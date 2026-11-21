import { mount, type VueWrapper } from '@vue/test-utils';
import SplitterPanel from './SplitterPanel.vue';

describe('SplitterPanel.vue', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(SplitterPanel, {
            attrs: {
                class: 'flex align-items-center justify-content-center'
            },
            slots: {
                default: 'Panel 1'
            }
        });
    });

    it('should exist', () => {
        expect(wrapper.find('.rs-splitterpanel').exists()).toBe(true);
        expect(wrapper.attributes().class).toBe('rs-splitterpanel flex align-items-center justify-content-center');
        expect(wrapper.find('.rs-splitterpanel').text()).toBe('Panel 1');
    });
});
