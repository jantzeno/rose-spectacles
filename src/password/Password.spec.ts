import { mount, type VueWrapper } from '@vue/test-utils';
import Password from './Password.vue';

describe('Password.vue', () => {
    let wrapper: VueWrapper<any>;
    const event = { target: { value: 'P' } };

    beforeEach(async () => {
        wrapper = mount(Password, {
            global: {
                stubs: {
                    teleport: true
                }
            },
            props: {
                modelValue: null
            }
        });

        await wrapper.vm.onFocus();
    });

    it('should exist', () => {
        expect(wrapper.find('.rs-password.rs-component').exists()).toBe(true);
        expect(wrapper.find('.rs-password-overlay').exists()).toBe(true);
    });

    it('describes password feedback with the visible panel', async () => {
        await wrapper.setProps({ overlayProps: { id: 'custom-password-feedback' } });
        const input = wrapper.get('input');
        const panel = wrapper.get('[role="dialog"]');

        expect(input.attributes('aria-expanded')).toBeUndefined();
        expect(input.attributes('aria-haspopup')).toBe('dialog');
        expect(input.attributes('aria-describedby')).toBe(panel.attributes('id'));
        expect(panel.attributes('id')).toBe('custom-password-feedback');
    });

    it('updates the existing live region when the password strength changes', async () => {
        const announcement = wrapper.get('[data-p-hidden-accessible][aria-live="polite"]');

        await wrapper.vm.onKeyUp({ target: { value: 'short' } });
        expect(announcement.text()).toBe('Weak');

        await wrapper.vm.onKeyUp({ target: { value: 'LongerPassword123' } });
        expect(announcement.text()).toBe('Strong');
    });

    it('should update modelValue', async () => {
        await wrapper.vm.onInput(event);

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['P']);
    });

    it('should meter update', async () => {
        expect(wrapper.find('.rs-password-content [data-pc-section="metertext"]').text()).toBe('Enter a password');

        await wrapper.vm.onKeyUp(event);

        expect(wrapper.find('.rs-password-content [data-pc-section="metertext"]').text()).toBe('Weak');

        expect(wrapper.find('.rs-password-meter-label').classes()).toContain('rs-password-meter-weak');
    });

    it('should toggle mask', async () => {
        await wrapper.setProps({ toggleMask: true });

        expect(wrapper.find('.rs-password-toggle-mask-icon.rs-password-unmask-icon').exists()).toBe(true);
        expect(wrapper.find('.rs-password-toggle-mask-icon.rs-password-mask-icon').exists()).toBe(false);

        await wrapper.vm.onMaskToggle();

        expect(wrapper.find('.rs-password-toggle-mask-icon.rs-password-unmask-icon').exists()).toBe(false);
        expect(wrapper.find('.rs-password-toggle-mask-icon.rs-password-mask-icon').exists()).toBe(true);
    });
});
