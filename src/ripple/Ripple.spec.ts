import { config, mount } from '@vue/test-utils';
import Ripple from './Ripple';

config.global.mocks = {
    $primevue: {
        config: {
            ripple: true
        }
    }
};

config.global.directives = {
    Ripple
};

describe('Ripple', () => {
    it('should exist', async () => {
        const wrapper = mount({
            template: `
                <div class="card rs-ripple" v-ripple>Default</div>
            `
        });

        const card = wrapper.find('.card');

        expect(wrapper.find('.rs-ink').exists()).toBe(true);

        await card.trigger('mousedown');

        expect(wrapper.find('.rs-ink').classes()).toContain('rs-ink-active');
    });
});
