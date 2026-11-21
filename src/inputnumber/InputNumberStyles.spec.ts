import { mount } from '@vue/test-utils';
import { h, nextTick, ref, type Component } from 'vue';
import Dialog from '../dialog/Dialog.vue';
import Form from '../forms/form/Form.vue';
import InputText from '../inputtext/InputText.vue';
import { Theme } from '../internal/styled/index';
import InputNumber from './InputNumber.vue';

it('writes InputNumber styles when a Form slot replaces it during rendering', async () => {
    const previousTheme = Theme.getTheme();
    Theme.update({
        theme: { preset: { components: { inputnumber: { css: '.rs-inputnumber { --rs-regression-21: 1; }' } } } }
    });
    const current = ref(false);
    const wrapper = mount(
        {
            render: () =>
                h(Dialog as Component, { visible: true, modal: true }, () =>
                    h(
                        Form as Component,
                        { initialValues: { mode: 'updated' } },
                        {
                            default: ({ mode }: { mode?: { value: string } }) => {
                                const key = current.value ? 'current' : 'initial';
                                current.value = mode?.value === 'updated';
                                return [
                                    h(InputText as Component, { name: 'mode' }),
                                    h(InputNumber as Component, { key, inputId: key, showButtons: true, buttonLayout: 'horizontal' })
                                ];
                            }
                        }
                    )
                )
        },
        { global: { stubs: { teleport: true } } }
    );

    try {
        await nextTick();
        await nextTick();
        expect(wrapper.get('input#current').element).toBeDefined();
        expect(document.head.querySelector('style[data-primevue-style-id="inputnumber-style"]')?.textContent ?? '').toContain('--rs-regression-21:1');
    } finally {
        wrapper.unmount();
        document.head.querySelector('style[data-primevue-style-id="inputnumber-style"]')?.remove();
        Theme.update({ theme: previousTheme ?? {} });
    }
});
