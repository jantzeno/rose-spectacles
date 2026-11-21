import { mount } from '@vue/test-utils';
import type { SelectPassThroughMethodOptions } from 'rose-spectacles/select';
import PrimeVue from '../config/Config';
import Select from './Select.vue';

it('provides selection and item context to Select pass-through sections', async () => {
    const options = [
        { label: 'Oslo', value: 'oslo', disabled: true },
        { label: 'Lima', value: 'lima', disabled: false }
    ];
    const attributes = ({ context }: SelectPassThroughMethodOptions<unknown>) => ({
        'data-option': context?.option?.value,
        'data-option-index': context?.index,
        'data-option-selected': String(context?.selected),
        'data-option-disabled': String(context?.disabled)
    });
    const wrapper = mount(Select, {
        props: {
            options,
            optionLabel: 'label',
            optionValue: 'value',
            optionDisabled: 'disabled',
            modelValue: 'lima',
            appendTo: 'self',
            pt: { root: attributes, label: attributes, optionLabel: attributes }
        },
        attrs: { 'data-form-field': 'destination' },
        global: { plugins: [PrimeVue] }
    });

    try {
        expect(wrapper.attributes('data-form-field')).toBe('destination');
        expect(wrapper.attributes('data-option')).toBe('lima');
        expect(wrapper.get('.rs-select-label').attributes('data-option-index')).toBe('1');

        await wrapper.trigger('click');
        const optionLabels = wrapper.findAll('.rs-select-option-label');
        expect(optionLabels.map((label) => label.attributes('data-option'))).toEqual(['oslo', 'lima']);
        expect(optionLabels.map((label) => label.attributes('data-option-selected'))).toEqual(['false', 'true']);
        expect(optionLabels.map((label) => label.attributes('data-option-disabled'))).toEqual(['true', 'false']);

        await wrapper.setProps({ modelValue: null });
        expect(wrapper.attributes('data-option-selected')).toBe('false');
        expect(wrapper.attributes('data-option-index')).toBe('-1');
    } finally {
        wrapper.unmount();
    }
});
