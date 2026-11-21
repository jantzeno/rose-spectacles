import { mount, type VueWrapper } from '@vue/test-utils';
import InputChips from './InputChips.vue';

describe('InputChips.vue', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(InputChips, {
            attachTo: document.body,
            props: {
                modelValue: null as unknown as unknown[]
            }
        });
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('should exist', () => {
        expect(wrapper.find('.rs-inputchips.rs-component.rs-inputwrapper').exists()).toBe(true);
        expect(wrapper.find('ul.rs-inputwrapper-filled').exists()).toBe(false);
        expect(wrapper.find('li.rs-inputchips-input-item').exists()).toBe(true);
    });

    it('focuses a prefilled chip on the first ArrowLeft before any input', async () => {
        await wrapper.setProps({ modelValue: ['One', 'Two'] });
        await wrapper.get('input').trigger('keydown', { code: 'ArrowLeft' });

        const lastChip = wrapper.findAll('.rs-inputchips-chip-item')[1];

        expect(lastChip.attributes('data-p-focused')).toBe('true');
        expect(wrapper.get('[role="listbox"]').attributes('aria-activedescendant')).toBe(lastChip.attributes('id'));
    });

    it('should add item', async () => {
        const addItem = vi.spyOn(wrapper.vm, 'addItem');

        await wrapper.vm.addItem({}, 'PrimeVue', false);

        await wrapper.setProps({ modelValue: ['PrimeVue'] });

        expect(addItem).toHaveBeenCalled();
        expect(wrapper.findAll('.rs-chip').length).toBe(1);
        expect(wrapper.find('.rs-chip-label').exists()).toBe(true);
        expect(wrapper.find('.rs-chip-label').text()).toBe('PrimeVue');
    });

    it('should prevent separator key when the chip is a rejected duplicate', async () => {
        await wrapper.setProps({ modelValue: ['foo'], separator: ',', allowDuplicate: false });

        const input = wrapper.find('input');

        input.element.value = 'foo';

        const event = new KeyboardEvent('keydown', { key: ',', code: 'Comma', cancelable: true });

        input.element.dispatchEvent(event);

        expect(event.defaultPrevented).toBe(true);
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    it('waits for text composition to finish before adding a chip', async () => {
        await wrapper.setProps({ separator: ',' });
        const input = wrapper.get('input').element;

        input.value = '가나';
        input.dispatchEvent(new CompositionEvent('compositionstart'));
        const composingComma = new KeyboardEvent('keydown', { key: ',', code: 'Comma', isComposing: true, cancelable: true });

        input.dispatchEvent(composingComma);

        expect(composingComma.defaultPrevented).toBe(false);
        expect(input.value).toBe('가나');
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();

        input.dispatchEvent(new CompositionEvent('compositionend', { data: '가나' }));
        input.dispatchEvent(new KeyboardEvent('keydown', { key: ',', code: 'Comma', cancelable: true }));
        expect(wrapper.emitted('update:modelValue')).toEqual([[['가나']]]);
        expect(input.value).toBe('');
    });

    it('should prevent separator key on empty input', async () => {
        await wrapper.setProps({ separator: ',' });

        const event = new KeyboardEvent('keydown', { key: ',', code: 'Comma', cancelable: true });

        wrapper.find('input').element.dispatchEvent(event);

        expect(event.defaultPrevented).toBe(true);
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    it('should have correct custom chip removal icon', async () => {
        await wrapper.setProps({
            modelValue: ['foo', 'bar'],
            chipIcon: 'pi pi-discord'
        });

        const icon = wrapper.find('[data-pc-section="removeicon"]');

        expect(icon.classes()).toContain('pi-discord');
    });
});
