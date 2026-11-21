import { mount } from '@vue/test-utils';
import InputText from '../inputtext/InputText.vue';
import Inplace from './Inplace.vue';

describe('Inplace.vue', () => {
    it('should exist', () => {
        const wrapper = mount(Inplace);

        expect(wrapper.find('.rs-inplace.rs-component').exists()).toBe(true);
    });

    it('should slots display', () => {
        const wrapper = mount(Inplace, {
            global: {
                components: {
                    InputText
                }
            },
            slots: {
                display: `
                    <span class="pi pi-search" style="vertical-align: middle"></span>
                    <span style="margin-left:.5rem; vertical-align: middle">View Picture</span>
                `,
                content: `<img src="/images/nature/nature1.jpg" />`
            }
        });

        expect(wrapper.find('.rs-inplace-display').exists()).toBe(true);

        wrapper.vm.open({});

        expect(wrapper.emitted()['update:active'][0]).toEqual([true]);

        wrapper.vm.close({});

        expect(wrapper.emitted()['update:active'][1]).toEqual([false]);
    });
});
