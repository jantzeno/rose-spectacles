import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [vue()],
    test: {
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
        setupFiles: [fileURLToPath(new URL('./src/config/Config.spec.js', import.meta.url))]
    }
});
