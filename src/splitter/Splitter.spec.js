import { mount } from '@vue/test-utils';
import SplitterPanel from '../splitterpanel/SplitterPanel.vue';
import Splitter from './Splitter.vue';

describe('Splitter.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(Splitter, {
            global: {
                components: {
                    SplitterPanel
                }
            },
            slots: {
                default: `
                    <SplitterPanel class="flex align-items-center justify-content-center">
                        Panel 1
                    </SplitterPanel>
                    <SplitterPanel class="flex align-items-center justify-content-center">
                        Panel 2
                    </SplitterPanel>
                `
            }
        });
    });

    it('should exist', () => {
        expect(wrapper.find('.rs-splitter.rs-component').exists()).toBe(true);
        expect(wrapper.find('.rs-splitter').classes()).toContain('rs-splitter-horizontal');
        expect(wrapper.findAll('.rs-splitterpanel').length).toBe(2);
        expect(wrapper.find('.rs-splitter-gutter-handle').exists()).toBe(true);
    });

    it('should mousedown', async () => {
        const gutter = wrapper.find('.rs-splitter-gutter-handle').element;
        const siblings = wrapper.findAll('.rs-splitterpanel');

        await wrapper.vm.onGutterMouseDown({ currentTarget: { gutter, previousElementSibling: siblings[0].element, nextElementSibling: siblings[1].element }, pageX: 123 }, 0);

        expect(wrapper.find('.rs-splitter').classes()).toContain('rs-splitter-horizontal');
    });
});
