import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import RoseSpectacles, { usePrimeVue } from './Config';

it('provides app configuration to components and merges locale overrides with defaults', () => {
    const consumer = defineComponent({
        setup() {
            const { config } = usePrimeVue();
            return () => h('div', [config.locale?.emptyMessage, h('span', config.locale?.accept)]);
        }
    });
    const wrapper = mount(consumer, {
        global: {
            plugins: [[RoseSpectacles, { locale: { emptyMessage: 'No notes' } }]]
        }
    });

    try {
        expect(wrapper.text()).toBe('No notesYes');
    } finally {
        wrapper.unmount();
    }
});
