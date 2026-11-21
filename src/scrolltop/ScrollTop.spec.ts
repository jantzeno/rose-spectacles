import { mount, type VueWrapper } from '@vue/test-utils';
import PrimeVue from '../config/Config';
import ScrollTop from './ScrollTop.vue';

describe('ScrollTop.vue', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(ScrollTop, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    transition: false
                }
            }
        });
    });

    it('should exist', async () => {
        await wrapper.setData({ visible: true });

        expect(wrapper.find('.rs-scrolltop.rs-component').exists()).toBe(true);
    });
});
