import { mount, type VueWrapper } from '@vue/test-utils';
import PrimeVue from '../config/Config';
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
        const event = { pageX: 100, pageY: 120, preventDefault: () => {} };
        const event2 = { pageX: 70, pageY: 20, preventDefault: () => {} };

        wrapper.vm.onColorMousedown(event);

        expect(onColorMousedown).toHaveBeenCalled();
        expect(wrapper.get<HTMLInputElement>('input.rs-colorpicker-preview').element.style.backgroundColor).not.toBe('rgb(255, 0, 0)');

        wrapper.vm.onHueMousedown(event2);

        expect(onHueMousedown).toHaveBeenCalled();
        expect(wrapper.get<HTMLInputElement>('input.rs-colorpicker-preview').element.style.backgroundColor).not.toBe('rgb(255, 0, 0)');
    });
});
