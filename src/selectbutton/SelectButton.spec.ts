import { mount, type VueWrapper } from '@vue/test-utils';
import { h, watch } from 'vue';
import Form from '../forms/form/Form.vue';
import FormField from '../forms/formfield/FormField.vue';
import SelectButton from './SelectButton.vue';

it('keeps every selected button pressed inside a multiple FormField', async () => {
    const wrapper = mount(Form, {
        slots: { default: () => h(FormField, { name: 'days' }, () => h(SelectButton, { multiple: true, options: ['Mon', 'Tue', 'Wed'] })) }
    });
    const updates: unknown[] = [];
    const stop = watch(
        () => wrapper.vm.getFieldState('days')?.value,
        (value) => updates.push(value),
        { flush: 'sync' }
    );

    try {
        const buttons = wrapper.findAll('button');
        for (const [index, button] of buttons.entries()) {
            await button.trigger('click');
            expect(buttons.slice(0, index + 1).map((option) => option.attributes('aria-pressed'))).toEqual(Array(index + 1).fill('true'));
        }

        expect(updates).toEqual([['Mon'], ['Mon', 'Tue'], ['Mon', 'Tue', 'Wed']]);
    } finally {
        stop();
        wrapper.unmount();
    }
});

it('allows multiple options to be deselected while keeping the last selection', async () => {
    const wrapper = mount(SelectButton, { props: { multiple: true, allowEmpty: false, options: ['Mon', 'Tue'], modelValue: ['Mon', 'Tue'] } });

    try {
        const [monday, tuesday] = wrapper.findAll('button');

        await monday.trigger('click');
        expect(wrapper.emitted('update:modelValue')).toEqual([[['Tue']]]);
        await tuesday.trigger('click');
        expect(wrapper.emitted('update:modelValue')).toEqual([[['Tue']]]);
        expect(tuesday.attributes('aria-pressed')).toBe('true');
    } finally {
        wrapper.unmount();
    }
});

describe('SelectButton.vue', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(SelectButton, {
            props: {
                modelValue: null,
                options: ['Off', 'On']
            }
        });
    });

    it('should exist', () => {
        expect(wrapper.find('.rs-selectbutton.rs-component').exists()).toBe(true);
        expect(wrapper.findAll('.rs-togglebutton.rs-component').length).toBe(2);
    });

    it('should option select', async () => {
        await wrapper.vm.onOptionSelect({}, wrapper.vm.options[0]);

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['Off']);

        await wrapper.setProps({ modelValue: wrapper.vm.options[0] });

        expect(wrapper.findAll('.rs-togglebutton.rs-component')[0].classes()).toContain('rs-togglebutton-checked');
    });
});

describe('multiple select', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(SelectButton, {
            props: {
                modelValue: null,
                options: [
                    { name: 'Option 1', value: 1 },
                    { name: 'Option 2', value: 2 },
                    { name: 'Option 3', value: 3 }
                ],
                optionLabel: 'name',
                multiple: true
            }
        });
    });

    it('should select', async () => {
        await wrapper.setProps({ modelValue: wrapper.vm.options });

        expect(wrapper.findAll('.rs-togglebutton-checked').length).toBe(3);
    });
});
