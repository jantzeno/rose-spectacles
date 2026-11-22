import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
import { preview } from 'vite';
import { browserDriver } from './browser-driver';

const server = await preview({ preview: { host: '127.0.0.1', port: 0, strictPort: true } });
const address = server.httpServer.address();
assert(address && typeof address !== 'string', 'Vite is listening on loopback');
const base = `http://127.0.0.1:${address.port}/`;

try {
    const browser = await browserDriver();
    console.log(`Testing the production gallery in ${browser.name}`);

    async function wait(expression: string, description: string) {
        const end = Date.now() + 8000;
        do {
            if (await browser.evaluate(expression)) return;
            await delay(50);
        } while (Date.now() < end);
        assert.fail(description);
    }

    async function show(hash: string) {
        await browser.navigate(base + hash);
        await wait(`document.querySelector('[data-example="${hash.slice(1)}"]')?.childElementCount > 0`, `The ${hash} example should render content`);
    }

    try {
        await show('#button');
        assert.equal(await browser.evaluate('document.querySelector("main button").textContent'), 'Save changes');
        const examples = await browser.evaluate<string[]>('Array.from(document.querySelectorAll("nav a"), (link) => link.hash)');
        assert(examples.length > 100, 'The gallery contains the component catalog');

        for (const hash of examples) {
            await show(hash);
            assert.deepEqual(await browser.evaluate('window.roseErrors'), [], `No browser errors in ${hash}`);
        }

        console.log(`${examples.length} gallery examples render`);

        await show('#select');
        const select = '[data-example="select"]';
        assert.equal(
            await browser.evaluate(`(() => {
                const combobox = document.querySelector('${select} [role="combobox"]');
                combobox.focus();
                return document.activeElement === combobox;
            })()`),
            true
        );
        await browser.keys(['Tab']);
        await wait(`document.activeElement === document.querySelector('${select} button[aria-label="Clear"]')`, 'Tab reaches the Select clear button');
        await browser.click(`${select} button[aria-label="Clear"]`);
        await wait(
            `document.querySelector('${select} output').textContent === 'null' &&
                document.activeElement === document.querySelector('${select} [role="combobox"]')`,
            'The Select clear button clears the value and restores focus after activation'
        );
        console.log('Tab reaches the Select clear button, and activating it clears the value and restores focus');

        await show('#chips');
        await browser.evaluate(`(() => {
            const root = document.querySelector('[data-example="chips"] .rs-inputchips');
            root.style.inlineSize = '12rem';
            const input = root.querySelector('input');
            input.value = 'LongTag'.repeat(18);
            input.dispatchEvent(new InputEvent('input', { bubbles: true }));
            return input.dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter', bubbles: true, cancelable: true }));
        })()`);
        const longChip = '[data-example="chips"] .rs-inputchips-chip-item:nth-child(2)';
        const removeChip = `${longChip} .rs-chip-remove-icon`;
        await wait(
            `(() => {
                const control = document.querySelector(${JSON.stringify(removeChip)});
                const input = control?.closest('ul');
                if (!input) return false;
                const outer = input.getBoundingClientRect();
                const button = control.getBoundingClientRect();
                return button.width > 0 && button.left >= outer.left && button.right <= outer.right + 1;
            })()`,
            'Long chips keep their remove controls inside the input'
        );
        await browser.click(removeChip);
        await wait(`!document.querySelector(${JSON.stringify(longChip)})`, 'The long chip can be removed');
        console.log('Long chips keep their remove controls inside the input');

        await show('#input-group');
        const smallGroupSizing = await browser.evaluate(`(() => {
            const group = document.querySelector('[data-example="input-group"] .rs-inputgroup');
            group.style.setProperty('--rs-inputgroup-addon-padding', '12px 16px');
            group.style.setProperty('--rs-inputtext-sm-font-size', '12px');
            group.style.setProperty('--rs-inputtext-sm-padding-y', '3px');
            group.style.setProperty('--rs-inputtext-sm-padding-x', '7px');
            return [group.querySelector('input'), group.querySelector('.rs-inputgroupaddon')].map((element) => {
                const style = getComputedStyle(element);
                return [style.fontSize, style.paddingBlockStart, style.paddingInlineStart];
            });
        })()`);
        assert.deepEqual(
            smallGroupSizing,
            [
                ['12px', '3px', '7px'],
                ['12px', '3px', '7px']
            ],
            'A small input group gives its text add-on the same font size and padding'
        );

        await show('#frozen-table-columns');
        const frozenHeader = '[data-example="frozen-table-columns"] th[data-p-frozen-column="true"]';
        const firstWidth = await browser.evaluate<number>(`document.querySelector(${JSON.stringify(frozenHeader)}).offsetWidth`);
        await browser.evaluate(`document.querySelector('[data-testid="frozen-table-width"]').style.width = '48rem'`);
        await wait(
            `document.querySelector(${JSON.stringify(frozenHeader)}).offsetWidth > ${firstWidth} + 40`,
            'Resizing the container changes the first frozen column width'
        );
        await wait(
            `(() => {
                const [first, second] = document.querySelectorAll(${JSON.stringify(frozenHeader)});
                const bodyCell = document.querySelector('[data-example="frozen-table-columns"] tr td:nth-child(2)');
                return Math.abs(parseFloat(second.style.insetInlineStart) - first.offsetWidth) <= 1 &&
                    Math.abs(parseFloat(bodyCell.style.insetInlineStart) - first.offsetWidth) <= 1;
            })()`,
            'Frozen table columns update their offsets after a container resize'
        );
        console.log('Frozen table columns update their offsets after a container resize');

        await show('#chart');
        await wait(
            `(() => {
            const canvas = document.querySelector('canvas');
            return canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data.some((channel, i) => i % 4 === 3 && channel > 0);
        })()`,
            'Chart paints its canvas'
        );
        const snapshot = await browser.evaluate<string>('document.querySelector("canvas").toDataURL()');
        await browser.click('[data-testid="chart-update"]');
        await wait(`document.querySelector('canvas').toDataURL() !== ${JSON.stringify(snapshot)}`, 'Chart repaints after a dataset update');
        console.log('Chart repaints after a dataset update');

        await show('#editor');
        await wait('document.querySelector(".ql-editor")?.textContent.includes("Field notes")', 'Editor initializes with its model value');
        await browser.click('.ql-editor');
        await browser.keys(['End', '!', 'R', 'S']);
        await wait('document.querySelector("[data-testid=editor-value]").textContent.includes("!RS")', 'User edits update the Vue model');
        await browser.click('button.ql-list[value="bullet"]');
        await wait(
            `(() => {
            const marker = document.querySelector('.ql-editor li[data-list="bullet"] .ql-ui');
            return marker && getComputedStyle(marker, '::before').content.includes('•');
        })()`,
            'The Quill toolbar displays a bullet marker'
        );
        assert.match(await browser.evaluate<string>('document.querySelector("[data-testid=editor-value]").textContent'), /<ul>/);
        console.log('Quill edits update the model and the bullet toolbar formats the list');

        await show('#dialog');
        await browser.click('[data-testid="overlay-open"]');
        await wait('document.activeElement?.getAttribute("data-testid") === "overlay-done"', 'Dialog focuses its autofocus target');
        await browser.keys(['Escape']);
        await wait(
            '!document.querySelector("[role=dialog]") && document.activeElement?.getAttribute("data-testid") === "overlay-open"',
            'Escape closes the dialog and restores trigger focus'
        );
        console.log('Escape closes the dialog and restores trigger focus');

        await show('#sidebar');
        await browser.click('[data-example="sidebar"] [data-testid="overlay-open"]');
        await wait(
            `(() => {
                const panel = document.querySelector('.rs-drawer');
                return panel && panel.scrollHeight > panel.clientHeight && getComputedStyle(panel).overflowY === 'auto';
            })()`,
            'Overflowing headless Sidebar content can scroll'
        );
        await browser.evaluate(`document.querySelector('.rs-drawer').scrollTop = 300`);
        assert.ok((await browser.evaluate<number>(`document.querySelector('.rs-drawer').scrollTop`)) > 0);
        console.log('Overflowing headless Sidebar content can scroll');

        await show('#popover');
        await browser.evaluate(`Object.assign(document.querySelector('[data-example="popover"] button').style, {
            position: 'fixed',
            top: '8rem',
            right: '1rem'
        })`);
        await browser.click('[data-example="popover"] button');
        await wait('document.querySelector(".rs-popover")?.getBoundingClientRect().width > 0', 'Popover opens beside its trigger');
        const widthBeforeResize = await browser.evaluate<number>('document.querySelector(".rs-popover").getBoundingClientRect().width');
        await browser.evaluate(`document.querySelector('.rs-popover-content p').style.width = 'min(60vw, 550px)'`);
        await wait(
            `(() => {
                const { left, right, width } = document.querySelector('.rs-popover').getBoundingClientRect();
                return width > ${widthBeforeResize} + 50 && left >= 0 && right <= innerWidth + 1;
            })()`,
            'Popover stays inside the viewport as its content widens'
        );
        console.log('Popover stays inside the viewport as its content widens');

        for (const component of ['select', 'multiselect']) {
            await show('#popover-choice-menus');
            const trigger = `[data-example="popover-choice-menus"] [data-testid="open-${component}-popover"]`;
            await browser.evaluate(`Object.assign(document.querySelector(${JSON.stringify(trigger)}).style, {
                position: 'fixed', top: '8rem', right: '1rem'
            })`);
            await browser.click(trigger);
            await wait(
                `(() => {
                    const popover = document.querySelector('.rs-popover');
                    const anchor = popover?.querySelector('.rs-${component}');
                    const panel = document.querySelector('.rs-${component}-overlay');
                    const entering = 'rs-anchored-overlay-enter-active';
                    if (!anchor || !panel || popover.classList.contains(entering) || panel.classList.contains(entering)) return false;
                    const anchorRect = anchor.getBoundingClientRect();
                    const panelRect = panel.getBoundingClientRect();
                    return Math.min(Math.abs(anchorRect.left - panelRect.left), Math.abs(anchorRect.right - panelRect.right)) <= 1;
                })()`,
                'Programmatically opened choice menus stay aligned inside a popover'
            );
            await show('#button');
        }
        console.log('Programmatically opened Select and MultiSelect panels stay aligned inside a popover');
    } finally {
        await browser.close();
    }
} finally {
    await new Promise<void>((resolve, reject) => server.httpServer.close((error) => (error ? reject(error) : resolve())));
}
