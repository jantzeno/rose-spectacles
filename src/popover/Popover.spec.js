import { mount } from '@vue/test-utils';
import PrimeVue from '../config/Config';
import Popover from './Popover.vue';

describe('Popover.vue', () => {
    let wrapper;

    beforeEach(async () => {
        wrapper = mount(Popover, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            slots: {
                default: 'PrimeVue'
            }
        });

        await wrapper.vm.toggle({}, {});
    });

    it('should exist', () => {
        expect(wrapper.find('.rs-popover.rs-component').exists()).toBe(true);
        expect(wrapper.find('.rs-popover-content').exists()).toBe(true);
        expect(wrapper.find('.rs-popover-content').text()).toBe('PrimeVue');
    });
});
