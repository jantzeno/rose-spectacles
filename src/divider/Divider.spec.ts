import { mount } from '@vue/test-utils';
import Divider from './Divider.vue';

describe('Divider.vue', () => {
    it('should exist', () => {
        const wrapper = mount(Divider);

        expect(wrapper.find('.rs-divider.rs-component').exists()).toBe(true);
        expect(wrapper.find('.rs-divider.rs-component').classes()).toContain('rs-divider-horizontal');
        expect(wrapper.find('.rs-divider.rs-component').classes()).toContain('rs-divider-left');
    });

    it('should exist', () => {
        const wrapper = mount(Divider, {
            props: {
                layout: 'vertical',
                align: 'center',
                type: 'dashed'
            }
        });

        expect(wrapper.find('.rs-divider-vertical').exists()).toBe(true);
        expect(wrapper.find('.rs-divider-dashed').exists()).toBe(true);
        expect(wrapper.find('.rs-divider-center').exists()).toBe(true);
    });
});
