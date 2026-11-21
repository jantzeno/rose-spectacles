import { mount } from '@vue/test-utils';
import InputMask from './InputMask.vue';

describe('InputMask.vue', () => {
    it('should exist', async () => {
        const wrapper = mount(InputMask, {
            props: {
                modelValue: null,
                mask: '99-999999',
                placeholder: '99-999999',
                unmask: true
            }
        });

        expect(wrapper.find('.rs-inputmask.rs-component').exists()).toBe(true);
        expect(wrapper.find('.rs-inputmask.rs-component').attributes().placeholder).toBe('99-999999');

        await wrapper.get('input').setValue('1');

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['1']);
    });

    it('keydown event', async () => {
        const wrapper = mount(InputMask, {
            props: {
                modelValue: null,
                mask: '99/99/9999'
            }
        });

        await wrapper.get('input').trigger('keydown', { code: 'KeyA' });

        expect(wrapper.emitted('keydown')?.[0]).toEqual([expect.objectContaining({ code: 'KeyA' })]);
    });
});
