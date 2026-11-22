import { mount } from '@vue/test-utils';
import { h, nextTick, ref, type Component } from 'vue';
import AutoComplete from '../autocomplete/AutoComplete.vue';
import Dropdown from '../dropdown/Dropdown.vue';
import Select from './Select.vue';

it.each([
    ['Select', Select],
    ['Dropdown', Dropdown],
    ['AutoComplete', AutoComplete]
] as const)('commits the active %s option on Tab without taking focus back', async (name, component) => {
    vi.useFakeTimers();
    const suggestions = ref<string[]>([]);
    const wrapper = mount(
        {
            setup: () => () =>
                h('div', [
                    h(component as Component, {
                        appendTo: 'self',
                        autoOptionFocus: true,
                        ...(name === 'AutoComplete'
                            ? { completeOnFocus: true, suggestions: suggestions.value, onComplete: () => (suggestions.value = ['Berlin']) }
                            : { options: ['Berlin'] })
                    }),
                    h('button', { type: 'button' }, 'Next field')
                ])
        },
        { attachTo: document.body }
    );

    try {
        const combobox = wrapper.get<HTMLElement>('[role="combobox"]');
        combobox.element.focus();
        await nextTick();
        if (name !== 'AutoComplete') await combobox.trigger('keydown', { code: 'ArrowDown' });
        expect(combobox.attributes('aria-expanded')).toBe('true');
        expect(combobox.attributes('aria-activedescendant')).toBeTruthy();

        const tab = new KeyboardEvent('keydown', { code: 'Tab', bubbles: true, cancelable: true });
        expect(combobox.element.dispatchEvent(tab)).toBe(true);
        const next = wrapper.get<HTMLButtonElement>('button');
        next.element.focus();
        await vi.runAllTimersAsync();

        expect(wrapper.getComponent(component as Component).emitted('update:modelValue')).toEqual([['Berlin']]);
        expect(combobox.attributes('aria-expanded')).toBe('false');
        expect(document.activeElement).toBe(next.element);
    } finally {
        wrapper.unmount();
        vi.useRealTimers();
    }
});
