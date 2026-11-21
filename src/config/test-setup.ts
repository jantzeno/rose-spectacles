import { defaultOptions } from '../core/config/PrimeVue';
import { config } from '@vue/test-utils';

config.global.mocks['$primevue'] = {
    config: defaultOptions
};

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
    }))
});
