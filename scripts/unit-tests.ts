import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { allowedNodeEnvironmentFlags, execPath } from 'node:process';

const resolve = createRequire(import.meta.url).resolve;
const runner = resolve('vitest/vitest.mjs');
const environment = { ...process.env };

// Vitest 0.29 uses jsdom's Storage. Node versions with their own Storage global must disable it for the worker.
if (allowedNodeEnvironmentFlags.has('--no-experimental-webstorage')) {
    environment.NODE_OPTIONS = [environment.NODE_OPTIONS, '--no-experimental-webstorage'].filter(Boolean).join(' ');
}

const result = spawnSync(execPath, [runner, 'run', ...process.argv.slice(2)], { env: environment, stdio: 'inherit' });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
