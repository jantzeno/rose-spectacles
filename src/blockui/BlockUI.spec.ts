import { mount, type VueWrapper } from '@vue/test-utils';
import PrimeVue from '../config/Config';
import { beforeEach, expect } from 'vitest';
import BlockUI from './BlockUI.vue';

let wrapper: VueWrapper<InstanceType<typeof BlockUI>>;

describe('BlockUI.vue', () => {
    beforeEach(() => {
        wrapper = mount(BlockUI, {
            attachTo: document.body,
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            }
        });
    });

    afterEach(() => {
        if (wrapper.exists()) wrapper.unmount();
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    it('mounts a mask when initially blocked', async () => {
        wrapper.unmount();
        wrapper = mount(BlockUI, {
            props: {
                blocked: true
            }
        });

        expect(wrapper.find('.rs-blockui-mask').exists()).toBe(true);
    });

    it('When blocked props value is changed, block or unblock method should be triggered', async () => {
        const blockSpy = vi.spyOn(wrapper.vm, 'block');
        const unblockSpy = vi.spyOn(wrapper.vm, 'unblock');

        await wrapper.setProps({ blocked: true });

        expect(blockSpy).toHaveBeenCalled();

        await wrapper.setProps({ blocked: false });

        expect(unblockSpy).toHaveBeenCalled();
    });

    it('When block method triggered, mask should be added on DOM', async () => {
        await wrapper.setProps({ fullScreen: true });
        await wrapper.vm.block();

        expect(document.querySelector('.rs-blockui')).not.toBe(null);
    });

    it('When removeMask method triggered, isBlocked should be false and emitted', async () => {
        wrapper.unmount();
        wrapper = mount(BlockUI, {
            props: {
                blocked: true
            },
            slots: {
                default: 'test'
            }
        });
        await wrapper.vm.removeMask();

        expect(wrapper.vm.isBlocked).toBe(false);
        expect(wrapper.emitted('unblock')).toHaveLength(1);
    });

    it('When blocked is toggled rapidly, only one mask should exist at a time', async () => {
        vi.useFakeTimers();

        wrapper.unmount();
        wrapper = mount(BlockUI, {
            attachTo: document.body,
            slots: { default: '<button>test</button>' }
        });

        for (let i = 0; i < 10; i++) {
            await wrapper.setProps({ blocked: true });

            expect(wrapper.element.querySelectorAll('.rs-blockui-mask').length).toBe(1);

            vi.advanceTimersByTime(5);
            await wrapper.setProps({ blocked: false });
            vi.advanceTimersByTime(5);

            expect(wrapper.element.querySelectorAll('.rs-blockui-mask').length).toBeLessThanOrEqual(1);
        }
    });

    it('When unblock is requested, the mask should stop capturing pointer events before it is removed', async () => {
        vi.useFakeTimers();

        wrapper.unmount();
        wrapper = mount(BlockUI, {
            attachTo: document.body,
            props: { blocked: true },
            slots: { default: '<button>test</button>' }
        });

        const mask = wrapper.get<HTMLElement>('.rs-blockui-mask').element;

        await wrapper.setProps({ blocked: false });

        expect(mask.style.pointerEvents).toBe('none');

        vi.advanceTimersByTime(300);

        expect(wrapper.element.querySelectorAll('.rs-blockui-mask').length).toBe(0);
        expect(wrapper.vm.isBlocked).toBe(false);
        expect(wrapper.emitted('unblock')).toHaveLength(1);
    });

    it('When blocked again before the leave animation ends, the pending removal should not drop the new mask', async () => {
        vi.useFakeTimers();

        wrapper.unmount();
        wrapper = mount(BlockUI, {
            attachTo: document.body,
            props: { blocked: true },
            slots: { default: '<button>test</button>' }
        });

        await wrapper.setProps({ blocked: false });
        await wrapper.setProps({ blocked: true });

        vi.advanceTimersByTime(500);

        expect(wrapper.element.querySelectorAll('.rs-blockui-mask').length).toBe(1);
        expect(wrapper.vm.isBlocked).toBe(true);
        expect(wrapper.emitted().unblock).toBeUndefined();
    });

    it('When the component is unmounted while blocked, the mask and the body scroll lock should be released', async () => {
        const maskCount = () => document.querySelectorAll('.rs-blockui-mask').length;
        const initialCount = maskCount();

        wrapper.unmount();
        wrapper = mount(BlockUI, {
            attachTo: document.body,
            props: { blocked: true, fullScreen: true }
        });

        expect(maskCount()).toBe(initialCount + 1);
        expect(document.body.classList.contains('rs-overflow-hidden')).toBe(true);

        wrapper.unmount();

        expect(maskCount()).toBe(initialCount);
        expect(document.body.classList.contains('rs-overflow-hidden')).toBe(false);
    });
});
