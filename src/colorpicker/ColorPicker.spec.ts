import { mount, type VueWrapper } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import PrimeVue from '../config/Config';
import Drawer from '../drawer/Drawer.vue';
import Form from '../forms/form/Form.vue';
import ColorPicker from './ColorPicker.vue';

describe('ColorPicker.vue', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(ColorPicker, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            props: {
                modelValue: null
            }
        });
    });

    it('should exist', () => {
        expect(wrapper.find('.rs-colorpicker.rs-component').exists()).toBe(true);
        expect(wrapper.find('input.rs-colorpicker-preview').exists()).toBe(true);
    });

    it('should input click triggered', async () => {
        const input = wrapper.find('input.rs-colorpicker-preview');
        const onInputClick = vi.spyOn(wrapper.vm, 'onInputClick');

        await input.trigger('click');

        expect(onInputClick).toHaveBeenCalled();
        expect(wrapper.find('.rs-colorpicker-panel').exists()).toBe(true);
        expect(wrapper.find('.rs-colorpicker-color-selector').exists()).toBe(true);
        expect(wrapper.find('.rs-colorpicker-hue').exists()).toBe(true);
    });

    it('should mouse events triggered', async () => {
        const input = wrapper.find('input.rs-colorpicker-preview');

        await input.trigger('click');

        const onColorMousedown = vi.spyOn(wrapper.vm, 'onColorMousedown');
        const onHueMousedown = vi.spyOn(wrapper.vm, 'onHueMousedown');
        await wrapper.get('.rs-colorpicker-color-selector').trigger('mousedown', { clientX: 100, clientY: 120 });

        expect(onColorMousedown).toHaveBeenCalled();
        expect(wrapper.get<HTMLInputElement>('input.rs-colorpicker-preview').element.style.backgroundColor).not.toBe('rgb(255, 0, 0)');

        await wrapper.get('.rs-colorpicker-hue').trigger('mousedown', { clientX: 70, clientY: 20 });

        expect(onHueMousedown).toHaveBeenCalled();
        expect(wrapper.get<HTMLInputElement>('input.rs-colorpicker-preview').element.style.backgroundColor).not.toBe('rgb(255, 0, 0)');
    });
});

it('starts with the initial Form value in the preview', () => {
    const wrapper = mount({
        render: () => h(Form, { initialValues: { color: '00ff00' } }, { default: () => h(ColorPicker, { name: 'color' }) })
    });

    try {
        expect(wrapper.get('input').element.style.backgroundColor).toBe('rgb(0, 255, 0)');
    } finally {
        wrapper.unmount();
    }
});

it.each(['Enter', 'Space'])('opens on %s and keeps the containing drawer open when Escape dismisses the picker', async (code) => {
    const wrapper = mount(
        { render: () => h(Drawer, { visible: true }, { default: () => h(ColorPicker, { appendTo: 'self' }) }) },
        { attachTo: document.body, global: { stubs: { teleport: true, transition: false } } }
    );

    try {
        await nextTick();
        const drawer = wrapper.getComponent(Drawer);
        const preview = wrapper.get('.rs-colorpicker-preview');

        await preview.trigger('keydown', { code });
        expect(wrapper.find('.rs-colorpicker-panel').exists()).toBe(true);

        await preview.trigger('keydown', { code: 'Escape' });
        expect(drawer.emitted('update:visible')).toBeUndefined();
        expect(wrapper.getComponent(ColorPicker).emitted('hide')).toEqual([[]]);

        await preview.trigger('keydown', { code: 'Escape' });
        expect(drawer.emitted('update:visible')).toEqual([[false]]);
    } finally {
        wrapper.unmount();
    }
});

it('selects a color at the left edge of the viewport', async () => {
    const wrapper = mount(ColorPicker, { props: { inline: true, modelValue: 'ff0000' } });

    try {
        await wrapper.get('.rs-colorpicker-color-selector').trigger('mousedown', { clientX: 0, clientY: 75 });

        expect(wrapper.emitted('update:modelValue')).toEqual([['808080']]);
    } finally {
        wrapper.unmount();
    }
});
