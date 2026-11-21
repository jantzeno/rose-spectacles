import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';
import { defineConfig, type UserConfig } from 'vitest/config';
import manifest from './package.json';

const sourceEntries = Object.entries(manifest.exports).flatMap(([subpath, entry]) => {
    const target = typeof entry === 'string' ? entry : 'default' in entry ? entry.default : undefined;
    if (!target) return [];

    const name = subpath === '.' ? manifest.name : `${manifest.name}/${subpath.slice(2)}`;
    const escaped = name.replace(/[.*+?^$${}()|[\]\\]/g, '\\$&');

    return [{ find: new RegExp(`^${escaped}$`), replacement: fileURLToPath(new URL(target, import.meta.url)) }];
});

export default defineConfig({
    resolve: { alias: sourceEntries },
    plugins: [vue()] as unknown as UserConfig['plugins'],
    test: {
        include: ['src/**/*.spec.ts', 'gallery/**/*.spec.ts'],
        globals: true,
        environment: 'jsdom',
        environmentOptions: { jsdom: { url: 'http://localhost/' } },
        onConsoleLog: (log, type) => {
            if (type === 'stderr' && log.includes('Could not parse CSS stylesheet')) return false;
        },
        coverage: {
            provider: 'istanbul',
            reporter: ['text', 'json', 'html']
        },
        setupFiles: [fileURLToPath(new URL('./src/config/test-setup.ts', import.meta.url))]
    }
});
