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

        await wrapper.vm.onGutterMouseDown(
            { currentTarget: { gutter, previousElementSibling: siblings[0].element, nextElementSibling: siblings[1].element }, pageX: 123 },
            0
        );

        expect(wrapper.find('.rs-splitter').classes()).toContain('rs-splitter-horizontal');
    });
});

it('sizes a newly inserted panel after the splitter DOM updates', async () => {
    const host = mount({
        components: { Splitter, SplitterPanel },
        props: { showPreview: Boolean },
        template: `
            <Splitter>
                <SplitterPanel key="main" :size="60">Main</SplitterPanel>
                <SplitterPanel v-if="showPreview" key="preview" :size="40">Preview</SplitterPanel>
            </Splitter>
        `
    });

    try {
        await host.setProps({ showPreview: true });

        const panels = host.findAll('.rs-splitterpanel');

        expect(panels.map((panel) => panel.text())).toEqual(['Main', 'Preview']);
        expect(panels.map((panel) => panel.element.style.flexBasis)).toEqual(['calc(60% - 4px)', 'calc(40% - 4px)']);

        await host.setProps({ showPreview: false });
        expect(host.findAll('.rs-splitterpanel').map((panel) => panel.text())).toEqual(['Main']);
    } finally {
        host.unmount();
    }
});
