import { mount, type VueWrapper } from '@vue/test-utils';
import Checkbox from './Checkbox.vue';

describe('Checkbox.vue', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(Checkbox, {
            props: {
                modelValue: false,
                binary: true
            }
        });
    });

    it('should exist', () => {
        expect(wrapper.find('.rs-checkbox.rs-component').exists()).toBe(true);
        expect(wrapper.find('.rs-checkbox-icon.pi.pi-check').exists()).toBe(false);
    });

    it('should exist', async () => {
        await wrapper.setProps({ modelValue: true });

        expect(wrapper.find('.rs-checkbox.rs-checkbox-checked').exists()).toBe(true);
    });
});
