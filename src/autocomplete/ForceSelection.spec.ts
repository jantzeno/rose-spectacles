import { mount } from '@vue/test-utils';
import AutoComplete from './AutoComplete.vue';

it('matches a numeric option label against the text input when forceSelection is enabled', async () => {
    const wrapper = mount(AutoComplete, {
        props: {
            forceSelection: true,
            optionLabel: 'label',
            suggestions: [{ label: 203, record: 'parcel' }]
        }
    });

    try {
        const input = wrapper.get('input');
        await input.setValue('203');
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([{ label: 203, record: 'parcel' }]);

        await input.setValue('204');
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null]);
        expect(input.element.value).toBe('');
    } finally {
        wrapper.unmount();
    }
});
