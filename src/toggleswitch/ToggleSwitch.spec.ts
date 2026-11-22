import { mount } from '@vue/test-utils';
import ToggleSwitch from './ToggleSwitch.vue';

it('restores the controlled checkbox until its model prop changes', async () => {
    const wrapper = mount(ToggleSwitch, { props: { modelValue: 'off', trueValue: 'on', falseValue: 'off' }, attachTo: document.body });

    try {
        const input = wrapper.get<HTMLInputElement>('[role="switch"]');
        input.element.click();
        input.element.click();

        expect(wrapper.emitted('update:modelValue')).toEqual([['on'], ['on']]);
        expect(input.element.checked).toBe(false);
        expect(input.attributes('aria-checked')).toBe('false');

        await wrapper.setProps({ modelValue: 'on' });
        expect(input.element.checked).toBe(true);
        expect(input.attributes('aria-checked')).toBe('true');
    } finally {
        wrapper.unmount();
    }
});

it('toggles local switch state initialized through defaultValue', async () => {
    const wrapper = mount(ToggleSwitch, { props: { defaultValue: true }, attachTo: document.body });

    try {
        const input = wrapper.get<HTMLInputElement>('[role="switch"]');
        expect(input.element.checked).toBe(true);
        input.element.click();
        await wrapper.vm.$nextTick();
        expect(input.element.checked).toBe(false);
        expect(input.attributes('aria-checked')).toBe('false');
        expect(wrapper.emitted('value-change')).toEqual([[false]]);
    } finally {
        wrapper.unmount();
    }
});

describe('ToggleSwitch.vue', () => {
    it('should exist', async () => {
        const wrapper = mount(ToggleSwitch);

        expect(wrapper.find('.rs-toggleswitch.rs-component').exists()).toBe(true);
        expect(wrapper.find('.rs-toggleswitch-slider').exists()).toBe(true);

        await wrapper.vm.onChange({});

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([true]);

        await wrapper.setProps({ modelValue: true });
        //
        expect(wrapper.vm.checked).toBe(true);
        expect(wrapper.find('.rs-toggleswitch').classes()).toContain('rs-toggleswitch-checked');
    });
});
