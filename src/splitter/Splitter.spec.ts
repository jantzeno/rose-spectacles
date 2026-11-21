import { mount, type VueWrapper } from '@vue/test-utils';
import SplitterPanel from '../splitterpanel/SplitterPanel.vue';
import Splitter from './Splitter.vue';

describe('Splitter.vue', () => {
    let wrapper: VueWrapper<any>;

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

    it('completes a mouse resize on document mouseup', async () => {
        await wrapper.get('.rs-splitter-gutter').trigger('mousedown', { clientX: 123 });
        expect(wrapper.attributes('data-p-resizing')).toBe('true');

        document.dispatchEvent(new MouseEvent('mouseup'));

        expect(wrapper.emitted('resizeend')).toHaveLength(1);
        expect(wrapper.attributes('data-p-resizing')).toBe('false');
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('completes a touch resize when the gesture ends outside the gutter', () => {
        const gutter = wrapper.find('.rs-splitter-gutter').element;
        const addListener = vi.spyOn(document, 'addEventListener');

        try {
            const touchStart = new Event('touchstart', { cancelable: true });
            Object.defineProperty(touchStart, 'changedTouches', { value: [{ pageX: 40, pageY: 10 }] });
            gutter.dispatchEvent(touchStart);

            const touchEnd = new Event('touchend');
            const listener = addListener.mock.calls.find(([name]) => name === 'touchend')?.[1] as EventListener;
            listener(touchEnd);

            expect(wrapper.emitted('resizeend')).toEqual([[{ originalEvent: touchEnd, sizes: [50, 50] }]]);
            expect(wrapper.attributes('data-p-resizing')).toBe('false');
        } finally {
            addListener.mockRestore();
            wrapper.vm.unbindTouchListeners();
        }
    });

    it('starts a mouse resize at the edge of the viewport', () => {
        const gutter = wrapper.find('.rs-splitter-gutter').element;
        const originalEvent = new MouseEvent('mousedown', { clientX: 0 });

        gutter.dispatchEvent(originalEvent);

        expect(wrapper.emitted('resizestart')).toEqual([[{ originalEvent, sizes: [50, 50] }]]);
        expect(wrapper.attributes('data-p-resizing')).toBe('true');
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

        const panels = host.findAll<HTMLElement>('.rs-splitterpanel');

        expect(panels.map((panel) => panel.text())).toEqual(['Main', 'Preview']);
        expect(panels.map((panel) => panel.element.style.flexBasis)).toEqual(['calc(60% - 4px)', 'calc(40% - 4px)']);

        await host.setProps({ showPreview: false });
        expect(host.findAll('.rs-splitterpanel').map((panel) => panel.text())).toEqual(['Main']);
    } finally {
        host.unmount();
    }
});
