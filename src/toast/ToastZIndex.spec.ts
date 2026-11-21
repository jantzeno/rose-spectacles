import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import PrimeVue from '../config/Config';
import ToastEventBus from '../toasteventbus/ToastEventBus';
import Toast from './Toast.vue';

it('keeps the z-index of a toast that arrives during the last message exit', async () => {
    vi.useFakeTimers();
    const wrapper = mount(Toast, {
        global: {
            plugins: [PrimeVue],
            stubs: { teleport: true }
        }
    });
    const first = { id: 'first', summary: 'First' };
    const second = { id: 'second', summary: 'Second' };

    try {
        await nextTick();
        const container = wrapper.get<HTMLElement>('.rs-toast').element;

        ToastEventBus.emit('add', first);
        await nextTick();
        wrapper.vm.onEnter();
        expect(container.style.zIndex).not.toBe('');

        ToastEventBus.emit('remove', first);
        await nextTick();
        wrapper.vm.onLeave();
        await vi.advanceTimersByTimeAsync(100);

        ToastEventBus.emit('add', second);
        await nextTick();
        wrapper.vm.onEnter();
        const secondZIndex = container.style.zIndex;
        expect(secondZIndex).not.toBe('');
        expect(wrapper.get('.rs-toast-summary').text()).toBe('Second');

        await vi.advanceTimersByTimeAsync(100);
        expect(container.style.zIndex).toBe(secondZIndex);

        ToastEventBus.emit('remove', second);
        await nextTick();
        wrapper.vm.onLeave();
        await vi.advanceTimersByTimeAsync(200);
        expect(container.style.zIndex).toBe('');
    } finally {
        wrapper.unmount();
        vi.useRealTimers();
    }
});
