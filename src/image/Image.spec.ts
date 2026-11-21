import { mount } from '@vue/test-utils';
import PrimeVue from '../config/Config';
import Image from './Image.vue';

describe('Image.vue', () => {
    it('should exist', () => {
        const wrapper = mount(Image, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            props: {
                src: 'images/galleria/galleria1.jpg'
            }
        });

        expect(wrapper.find('.rs-image.rs-component').exists()).toBe(true);
        expect(wrapper.find('.rs-image.rs-component img').attributes().src).toBe('images/galleria/galleria1.jpg');
    });

    it('should preview', async () => {
        const wrapper = mount(Image, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            props: {
                src: 'images/galleria/galleria1.jpg',
                preview: true
            }
        });

        expect(wrapper.find('.rs-image-preview').exists()).toBe(true);
        expect(wrapper.find('.rs-image-toolbar').exists()).toBe(false);
        expect(wrapper.find('.rs-image-preview-mask').exists()).toBe(true);

        await wrapper.setData({ maskVisible: true });

        expect(wrapper.find('.rs-image-mask').exists()).toBe(true);
        expect(wrapper.find('.rs-image-toolbar').exists()).toBe(true);
    });

    it('releases the scroll lock and mask z-index when unmounted with a preview open', async () => {
        vi.useFakeTimers();
        const wrapper = mount(Image, {
            attachTo: document.body,
            global: { plugins: [PrimeVue], stubs: { teleport: true, transition: false } },
            props: { src: 'images/galleria/galleria1.jpg', preview: true }
        });

        try {
            await wrapper.get('button.rs-image-preview-mask').trigger('click');
            await vi.advanceTimersByTimeAsync(25);

            const mask = wrapper.get<HTMLElement>('[role="dialog"]').element;
            expect(document.body.classList.contains('rs-overflow-hidden')).toBe(true);
            expect(mask.style.zIndex).not.toBe('');

            wrapper.unmount();

            expect(document.body.classList.contains('rs-overflow-hidden')).toBe(false);
            expect(mask.style.zIndex).toBe('');
        } finally {
            if (wrapper.exists()) wrapper.unmount();
            document.body.classList.remove('rs-overflow-hidden');
            document.body.style.removeProperty('--rs-scrollbar-width');
            vi.useRealTimers();
        }
    });
});
