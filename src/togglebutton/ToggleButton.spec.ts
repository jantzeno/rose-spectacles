import { mount, type VueWrapper } from '@vue/test-utils';
import ToggleButton from './ToggleButton.vue';

it('keeps the controlled button unpressed until the model prop changes', async () => {
    const wrapper = mount(ToggleButton, { props: { modelValue: false } });

    try {
        const button = wrapper.get('button');
        await button.trigger('click');
        await button.trigger('click');

        expect(wrapper.emitted('update:modelValue')).toEqual([[true], [true]]);
        expect(button.attributes('aria-pressed')).toBe('false');

        await wrapper.setProps({ modelValue: true });
        expect(button.attributes('aria-pressed')).toBe('true');
    } finally {
        wrapper.unmount();
    }
});

it('toggles local button state initialized through defaultValue', async () => {
    const wrapper = mount(ToggleButton, { props: { defaultValue: false } });

    try {
        const button = wrapper.get('button');
        expect(button.attributes('aria-pressed')).toBe('false');
        await button.trigger('click');
        expect(button.attributes('aria-pressed')).toBe('true');
        expect(wrapper.emitted('value-change')).toEqual([[true]]);
    } finally {
        wrapper.unmount();
    }
});

describe('ToggleButton', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(ToggleButton, {
            props: {
                modelValue: false,
                onIcon: 'pi pi-check',
                offIcon: 'pi pi-times'
            }
        });
    });

    it('is ToggleButton exist', () => {
        expect(wrapper.find('.rs-togglebutton.rs-component').exists()).toBe(true);
        expect(wrapper.find('span.pi-times.rs-togglebutton-icon').exists()).toBe(true);
    });

    it('should have onIcon', async () => {
        await wrapper.setProps({ modelValue: true });

        expect(wrapper.find('span.pi-check').exists()).toBe(true);
    });

    it('should change works', async () => {
        await wrapper.vm.onChange({});

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([true]);

        await wrapper.setProps({ modelValue: true });
        await wrapper.vm.onChange({});

        expect(wrapper.emitted()['update:modelValue'][1]).toEqual([false]);
    });

    it('should be customized', async () => {
        await wrapper.setProps({
            modelValue: true,
            onLabel: 'I confirm',
            offLabel: 'I reject',
            style: 'width: 10em'
        });

        expect(wrapper.find('.rs-togglebutton-label').text()).toBe('I confirm');
        expect(wrapper.attributes().style).toContain('width: 10em');

        await wrapper.setProps({ modelValue: false });

        expect(wrapper.find('.rs-togglebutton-label').text()).toBe('I reject');
    });
});
