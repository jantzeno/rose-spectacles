import { mount, type VueWrapper } from '@vue/test-utils';
import ProgressBar from './ProgressBar.vue';

describe('ProgressBar.vue', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(ProgressBar, {
            props: {
                value: 0
            }
        });
    });

    it('should exist', () => {
        expect(wrapper.find('.rs-progressbar.rs-component').exists()).toBe(true);
        expect(wrapper.find('.rs-progressbar').attributes()['aria-valuemin']).toBe('0');
        expect(wrapper.find('.rs-progressbar').attributes()['aria-valuemax']).toBe('100');
    });

    it('should value work', async () => {
        await wrapper.setProps({ value: 10 });

        expect(wrapper.find('.rs-progressbar').attributes()['aria-valuenow']).toBe('10');
        expect(wrapper.find('.rs-progressbar-label').text()).toBe('10%');
    });

    it('should not show value', async () => {
        await wrapper.setProps({ showValue: false });

        expect(wrapper.find('.rs-progressbar-label').exists()).toBe(false);
    });
});
