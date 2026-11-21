import { mount } from '@vue/test-utils';
import Steps from './Steps.vue';

it('activates the focused step on Enter', async () => {
    const wrapper = mount(Steps, { props: { readonly: false, model: [{ label: 'First' }, { label: 'Second' }] } });

    try {
        const second = wrapper.get('[data-pc-section="item"]:nth-child(2)');

        await second.trigger('keydown', { code: 'Enter' });

        expect(wrapper.emitted('update:activeStep')).toEqual([[1]]);
        expect(second.attributes('aria-current')).toBe('step');
    } finally {
        wrapper.unmount();
    }
});
