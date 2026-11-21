import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref, watch, type Component } from 'vue';
import BaseStyle from '../core/base/style/BaseStyle';
import { Theme } from '../internal/styled/index';
import Button from './Button.vue';

it('injects the button theme after the original mount is interrupted', async () => {
    vi.useFakeTimers();
    const previousTheme = Theme.getTheme();
    Theme.update({ theme: { preset: { components: { button: { borderRadius: '10px' } } } } });
    const view = defineComponent({
        setup() {
            const request = ref(false);
            const loading = ref(false);
            watch(request, () => {
                loading.value = true;
                setTimeout(() => (loading.value = false), 0);
            });
            request.value = true;

            return () => (loading.value ? null : h(Button as Component, { label: 'Save' }));
        }
    });
    const viewReady = ref(false);
    const wrapper = mount({ render: () => (viewReady.value ? h(view) : null) });

    try {
        viewReady.value = true;
        await nextTick();
        expect(wrapper.find('button').exists()).toBe(false);

        await vi.advanceTimersByTimeAsync(0);
        await nextTick();
        expect(wrapper.get('button').text()).toBe('Save');
        const stylesheet = document.head.querySelector('style[data-primevue-style-id="button-variables"]');
        expect(stylesheet?.textContent ?? '').toContain('--rs-button-border-radius:10px');
    } finally {
        wrapper.unmount();
        document.head.querySelector('style[data-primevue-style-id="button-variables"]')?.remove();
        Theme.update({ theme: previousTheme ?? {} });
        vi.useRealTimers();
    }
});

it.each([{ manual: true }, { immediate: false }])('honors deferred shared stylesheet loading with %o', (options) => {
    const style = BaseStyle.load('.rs-audit-test { color: red }', { name: 'audit-test', ...options });

    try {
        expect(style.el?.value).toBeNull();
        style.load?.();
        expect(style.el?.value?.isConnected).toBe(true);
    } finally {
        style.unload?.();
    }
});
