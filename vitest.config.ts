import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';
import { defineConfig, type UserConfig } from 'vitest/config';

export default defineConfig({
    plugins: [vue()] as unknown as UserConfig['plugins'],
    test: {
        include: ['src/**/*.spec.{js,ts}'],
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
