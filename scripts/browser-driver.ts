import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import { existsSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright-core';

export interface BrowserDriver {
    name: string;
    navigate(url: string): Promise<void>;
    evaluate<T>(expression: string): Promise<T>;
    click(selector: string): Promise<void>;
    keys(values: string[]): Promise<void>;
    close(): Promise<void>;
}

function browserPath(names: string[]) {
    return names.find((name) => spawnSync(name, ['--version'], { stdio: 'ignore' }).status === 0);
}

export async function browserDriver(): Promise<BrowserDriver> {
    const systemChromium = browserPath(['chromium', 'chromium-browser', 'google-chrome']);

    if (!process.env.ROSE_USE_FIREFOX && (systemChromium || existsSync(chromium.executablePath()))) {
        const browser = await chromium.launch({ executablePath: systemChromium, headless: true });
        const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
        await page.addInitScript(capturePageErrors);
        return {
            name: 'Chromium',
            async navigate(url) {
                await page.goto(url);
            },
            evaluate: (expression) => page.evaluate(expression),
            click: (selector) => page.locator(selector).click(),
            async keys(values) {
                for (const value of values) {
                    if (['End', 'Escape', 'Tab'].includes(value)) await page.keyboard.press(value);
                    else await page.keyboard.insertText(value);
                }
            },
            close: () => browser.close()
        };
    }

    if (!browserPath(['firefox'])) throw new Error('Install Chromium or Firefox to run the gallery browser tests.');
    return firefoxDriver();
}

function capturePageErrors() {
    const errors: string[] = [];
    (window as Window & { roseErrors?: string[] }).roseErrors = errors;
    window.addEventListener('error', (event) => errors.push(String(event.error ?? event.message)));
    window.addEventListener('unhandledrejection', (event) => errors.push(String(event.reason)));
}

interface Message {
    id: number;
    type: 'success' | 'error';
    result: unknown;
    error?: string;
    message?: string;
}

function timeout<T>(promise: Promise<T>, message: string, ms = 10000): Promise<T> {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error(message)), ms);
        promise.then(resolve, reject).finally(() => clearTimeout(timer));
    });
}

async function firefoxDriver(): Promise<BrowserDriver> {
    const profile = await mkdtemp(join(tmpdir(), 'rose-firefox-'));
    const child = spawn('firefox', ['--headless', '--no-remote', '--profile', profile, '--remote-debugging-port', '0', 'about:blank'], {
        detached: true,
        stdio: ['ignore', 'ignore', 'pipe']
    });
    const stopped = once(child, 'close');
    let socket: WebSocket | undefined;
    let closing: Promise<void> | undefined;
    const close = () =>
        (closing ??= (async () => {
            socket?.close();

            if (child.pid) {
                const stopGroup = (signal: NodeJS.Signals) => {
                    try {
                        process.kill(-child.pid!, signal);
                    } catch (error) {
                        if ((error as NodeJS.ErrnoException).code !== 'ESRCH') throw error;
                    }
                };
                stopGroup('SIGTERM');
                await Promise.race([stopped.catch(() => []), delay(1500)]);
                stopGroup('SIGKILL');
            }

            await stopped.catch(() => []);
            await rm(profile, { recursive: true, force: true });
            process.off('SIGINT', interrupt);
            process.off('SIGTERM', terminate);
        })());
    const interrupt = () => {
        process.exitCode = 130;
        void close();
    };
    const terminate = () => {
        process.exitCode = 143;
        void close();
    };
    process.once('SIGINT', interrupt);
    process.once('SIGTERM', terminate);

    try {
        const endpoint = await timeout(
            new Promise<string>((resolve, reject) => {
                let stderr = '';
                child.stderr.on('data', (chunk) => {
                    stderr = (stderr + String(chunk)).slice(-8192);
                    const match = stderr.match(/WebDriver BiDi listening on (ws:\/\/(?:127\.0\.0\.1|localhost|\[::1\]):\d+)/);
                    if (match) resolve(`${match[1]}/session`);
                });
                child.once('error', reject);
                child.once('exit', () => reject(new Error(`Firefox exited during startup. ${stderr}`)));
            }),
            'Firefox did not expose a BiDi endpoint',
            20000
        );

        const connection = new WebSocket(endpoint);
        socket = connection;
        await timeout(
            new Promise<void>((resolve, reject) => {
                connection.addEventListener('open', () => resolve(), { once: true });
                connection.addEventListener('error', () => reject(new Error('Firefox BiDi connection failed')), { once: true });
            }),
            'Firefox BiDi did not connect'
        );

        let nextId = 0;
        const pending = new Map<number, (message: Message) => void>();
        connection.addEventListener('message', (event) => {
            const message = JSON.parse(String(event.data)) as Message;
            pending.get(message.id)?.(message);
        });
        async function command<T>(method: string, params: Record<string, unknown> = {}): Promise<T> {
            const id = ++nextId;
            try {
                return await timeout(
                    new Promise<T>((resolve, reject) => {
                        pending.set(id, (message) => {
                            if (message.type === 'error') reject(new Error(`${message.error}: ${message.message}`));
                            else resolve(message.result as T);
                        });
                        connection.send(JSON.stringify({ id, method, params }));
                    }),
                    `Firefox BiDi timed out for ${method}`
                );
            } finally {
                pending.delete(id);
            }
        }

        await command('session.new', { capabilities: {} });
        const { contexts } = await command<{ contexts: { context: string }[] }>('browsingContext.getTree');
        const { context } = contexts[0];
        await command('browsingContext.setViewport', { context, viewport: { width: 1280, height: 800 }, devicePixelRatio: 1 });
        await command('script.addPreloadScript', { functionDeclaration: capturePageErrors.toString() });

        async function evaluate<T>(expression: string): Promise<T> {
            const result = await command<{ type: string; exceptionDetails?: { text: string }; result: { value: string } }>('script.evaluate', {
                target: { context },
                expression: `(async () => JSON.stringify(await (${expression})))()`,
                awaitPromise: true
            });

            if (result.type === 'exception') throw new Error(result.exceptionDetails?.text);
            return JSON.parse(result.result.value) as T;
        }

        async function actions(sequence: unknown[]) {
            try {
                await command('input.performActions', { context, actions: sequence });
            } finally {
                await command('input.releaseActions', { context });
            }
        }

        return {
            name: 'Firefox',
            async navigate(url) {
                await command('browsingContext.navigate', { context, url, wait: 'complete' });
            },
            evaluate,
            async click(selector) {
                const point = await evaluate<{ x: number; y: number }>(`(async () => {
                    const target = document.querySelector(${JSON.stringify(selector)});
                    if (!target) throw new Error('Missing click target');
                    target.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' });
                    await new Promise(requestAnimationFrame);
                    const rect = target.getBoundingClientRect();
                    return { x: Math.round(rect.x + rect.width / 2), y: Math.round(rect.y + rect.height / 2) };
                })()`);
                await actions([
                    {
                        type: 'pointer',
                        id: 'mouse',
                        parameters: { pointerType: 'mouse' },
                        actions: [
                            { type: 'pointerMove', origin: 'viewport', ...point },
                            { type: 'pointerDown', button: 0 },
                            { type: 'pointerUp', button: 0 }
                        ]
                    }
                ]);
            },
            async keys(values) {
                const special: Record<string, string> = { Escape: '\uE00C', End: '\uE010', Tab: '\uE004' };
                await actions([
                    {
                        type: 'key',
                        id: 'keyboard',
                        actions: values.flatMap((key) => {
                            const value = special[key] ?? key;
                            return [
                                { type: 'keyDown', value },
                                { type: 'keyUp', value }
                            ];
                        })
                    }
                ]);
            },
            close
        };
    } catch (error) {
        await close();
        throw error;
    }
}
