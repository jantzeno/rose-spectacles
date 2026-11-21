import { mount, type VueWrapper } from '@vue/test-utils';
import type { AutoCompleteProps } from 'rose-spectacles/autocomplete';
import PrimeVue from '../config/Config';
import OverlayEventBus from '../overlayeventbus/OverlayEventBus';
import { defineComponent, h, nextTick, reactive, toRaw, type Component } from 'vue';
import VirtualScroller from '../virtualscroller/VirtualScroller.vue';
import AutoComplete from './AutoComplete.vue';

type AutoCompleteWrapper = VueWrapper<InstanceType<typeof AutoComplete>>;
type City = { name: string; code: string; disabled?: boolean };

const cities = (): City[] => [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
];

const cityNames = () => cities().map((city) => city.name);

const mountAutoComplete = (props: AutoCompleteProps = {}, component: Component = AutoComplete): AutoCompleteWrapper =>
    mount(component, {
        global: {
            plugins: [PrimeVue],
            stubs: {
                teleport: true
            }
        },
        props: { multiple: true, suggestions: cities(), optionLabel: 'name', ...props }
    }) as unknown as AutoCompleteWrapper;

const openOverlay = async (wrapper: AutoCompleteWrapper) => {
    wrapper.vm.show();
    await nextTick();
};

// The labels of the rendered options shown as selected. Fails if aria-selected, data-p-selected and the selected
// class disagree, since each of them asks isSelected on its own.
const selectedLabels = (wrapper: AutoCompleteWrapper) =>
    wrapper
        .findAll('li.rs-autocomplete-option')
        .filter((option) => {
            const selected = option.attributes('aria-selected') === 'true';

            expect(option.attributes('data-p-selected')).toBe(String(selected));
            expect(option.classes('rs-autocomplete-option-selected')).toBe(selected);

            return selected;
        })
        .map((option) => option.attributes('aria-label'));

const lastEmittedValue = <T = unknown>(wrapper: AutoCompleteWrapper) => wrapper.emitted<[T]>('update:modelValue')?.at(-1)?.[0];

it('renders the content slot in place of the default suggestion list', async () => {
    const wrapper = mount(AutoComplete, {
        props: { appendTo: 'self', suggestions: ['Oslo', 'Berlin'] },
        slots: {
            content: ({ items, id }: { items: string[]; id: string }) =>
                h(
                    'ul',
                    { id, 'data-custom-suggestions': '' },
                    items.map((item) => h('li', item))
                )
        }
    });

    try {
        await openOverlay(wrapper);

        const list = wrapper.get('[data-custom-suggestions]');

        expect(list.findAll('li').map((option) => option.text())).toEqual(['Oslo', 'Berlin']);
        expect(list.attributes('id')).toBe(wrapper.get('[role="combobox"]').attributes('aria-controls'));
        expect(wrapper.find('.rs-autocomplete-list').exists()).toBe(false);
    } finally {
        wrapper.unmount();
    }
});

it('extends text selection from the caret with Shift+Home and Shift+End', async () => {
    const wrapper = mountAutoComplete({ multiple: false, modelValue: 'Amsterdam' });

    try {
        const input = wrapper.get('input');

        input.element.setSelectionRange(3, 3);
        await input.trigger('keydown', { code: 'Home', shiftKey: true });
        expect([input.element.selectionStart, input.element.selectionEnd, input.element.selectionDirection]).toEqual([0, 3, 'backward']);

        await input.trigger('keydown', { code: 'End', shiftKey: true });
        expect([input.element.selectionStart, input.element.selectionEnd, input.element.selectionDirection]).toEqual([3, 9, 'forward']);
    } finally {
        wrapper.unmount();
    }
});

it.each(['Ber', 'Berlin'])('commits only the clicked suggestion with force selection after typing %s', async (query) => {
    const wrapper = mountAutoComplete({ multiple: false, forceSelection: true, suggestions: ['Berlin', 'Berlin 2'], optionLabel: undefined });

    try {
        await openOverlay(wrapper);

        const input = wrapper.get('input');
        const option = wrapper.get('li[aria-label="Berlin 2"]');

        input.element.value = query;
        const allowsFocusChange = option.element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));

        if (allowsFocusChange) await input.trigger('change');
        await option.trigger('click');

        expect(wrapper.emitted('update:modelValue')).toEqual([['Berlin 2']]);
        expect(wrapper.emitted('option-select')).toEqual([[expect.objectContaining({ value: 'Berlin 2' })]]);
    } finally {
        wrapper.unmount();
    }
});

describe('AutoComplete.vue', () => {
    let wrapper: AutoCompleteWrapper;

    beforeEach(async () => {
        wrapper = mount(AutoComplete, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            props: {
                field: 'name'
            }
        });

        await wrapper.trigger('click');
    });

    it('should exists', () => {
        expect(wrapper.find('.rs-autocomplete.rs-component').exists()).toBe(true);
        expect(wrapper.find('.rs-autocomplete-input').exists()).toBe(true);
    });

    it('search complete', async () => {
        await wrapper.get('input').setValue('b');

        wrapper.vm.search(new Event('input'), 'b', 'input');
        await wrapper.vm.$nextTick();

        await wrapper.setProps({
            suggestions: [{ name: 'Bahrain', code: 'BH' }]
        });

        expect(wrapper.find('.rs-autocomplete-list').exists()).toBe(true);
        expect(wrapper.findAll('.rs-autocomplete-option').length).toBe(1);
    });

    it('should show overlay and empty-message if there are no suggestions', async () => {
        wrapper.vm.search(new Event('input'), 'b', 'input');
        await wrapper.vm.$nextTick();

        await wrapper.setProps({
            suggestions: []
        });

        expect(wrapper.find('.rs-autocomplete-list').exists()).toBe(true);
        expect(wrapper.findAll('.rs-autocomplete-option').length).toBe(0);
        expect(wrapper.find('.rs-autocomplete-empty-message').exists()).toBe(true);
    });

    it('dropdown', () => {
        it('should have correct custom icon', async () => {
            wrapper.setProps({
                dropdown: true,
                dropdownIcon: 'pi pi-discord'
            });

            await nextTick();

            const token = wrapper.find('.rs-button').find('span');

            expect(token.classes()).toContain('pi-discord');
        });
    });

    it('multiple', () => {
        it('should have correct custom icon', async () => {
            wrapper.setProps({
                multiple: true,
                removeTokenIcon: 'pi pi-discord',
                modelValue: ['foo', 'bar']
            });

            await nextTick();

            wrapper.findAll('.rs-autocomplete-token-icon').forEach((tokenIcon) => {
                expect(tokenIcon.classes()).toContain('pi-discord');
            });
        });
    });

    describe('nested overlays', () => {
        let overlay: HTMLElement;
        let nestedOverlay: HTMLDivElement;

        beforeEach(async () => {
            vi.useFakeTimers();

            wrapper.vm.search(new Event('input'), 'b', 'input');
            await wrapper.setProps({ suggestions: [{ name: 'Bahrain', code: 'BH' }] });

            overlay = wrapper.get<HTMLElement>('.rs-autocomplete-overlay').element;
            wrapper.vm.onOverlayEnter(overlay);
            wrapper.vm.onOverlayAfterEnter();

            nestedOverlay = document.createElement('div');
            document.body.appendChild(nestedOverlay);
        });

        afterEach(() => {
            wrapper.vm.onOverlayLeave(overlay);
            nestedOverlay.remove();
            vi.useRealTimers();
        });

        const outsideClick = (target = document.body) => {
            target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            vi.runAllTimers();
        };

        const clickOnNestedOverlay = (emitterTarget: Element | null) => {
            nestedOverlay.addEventListener('mousedown', (e) => OverlayEventBus.emit('overlay-click', { originalEvent: e, target: emitterTarget }), {
                once: true
            });
            nestedOverlay.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            outsideClick(nestedOverlay);
        };

        it('should close on an outside click', () => {
            outsideClick();

            expect(wrapper.vm.overlayVisible).toBe(false);
        });

        it('should stay open when an overlay of a component inside the panel is clicked', () => {
            clickOnNestedOverlay(overlay.firstElementChild);

            expect(wrapper.vm.overlayVisible).toBe(true);
        });

        it('should close when an overlay of a component outside the panel is clicked', () => {
            clickOnNestedOverlay(document.body);

            expect(wrapper.vm.overlayVisible).toBe(false);
        });

        it('should close on a regular outside click after a nested overlay click', () => {
            clickOnNestedOverlay(overlay.firstElementChild);
            outsideClick();

            expect(wrapper.vm.overlayVisible).toBe(false);
        });

        it('should stay open on an outside click while an overlay of a component inside the panel is open', () => {
            const combobox = document.createElement('span');

            combobox.setAttribute('aria-expanded', 'true');
            overlay.appendChild(combobox);
            outsideClick();

            expect(wrapper.vm.overlayVisible).toBe(true);

            combobox.setAttribute('aria-expanded', 'false');
            outsideClick();

            expect(wrapper.vm.overlayVisible).toBe(false);
        });
    });
});

describe('AutoComplete.vue selection', () => {
    describe('multiple selection', () => {
        it('should match primitive values', async () => {
            const wrapper = mountAutoComplete({ suggestions: cityNames(), optionLabel: undefined, modelValue: ['Rome', 'Paris'] });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);
        });

        it('should not compare each suggestion against every selected value while rendering', async () => {
            // Guards #728: a per-row scan of the selection made the overlay slow to open with many selected values.
            const wrapper = mountAutoComplete({ suggestions: cityNames(), optionLabel: undefined, modelValue: ['Rome'] });
            const isEquals = vi.spyOn(wrapper.vm, 'isEquals');

            await openOverlay(wrapper);
            await wrapper.setProps({ modelValue: ['Rome', 'Paris'] });

            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);
            expect(isEquals).not.toHaveBeenCalled();
        });

        it('should not compare suggestions selected by reference or by dataKey while rendering', async () => {
            const suggestions = cities();
            const byReference = mountAutoComplete({ suggestions, modelValue: [...suggestions] });
            const byDataKey = mountAutoComplete({ dataKey: 'code', modelValue: cities().map(({ code }) => ({ code })) });
            const referenceEquals = vi.spyOn(byReference.vm, 'isEquals');
            const dataKeyEquals = vi.spyOn(byDataKey.vm, 'isEquals');

            await openOverlay(byReference);
            await openOverlay(byDataKey);

            expect(selectedLabels(byReference)).toEqual(cityNames());
            expect(selectedLabels(byDataKey)).toEqual(cityNames());
            expect(referenceEquals).not.toHaveBeenCalled();
            expect(dataKeyEquals).not.toHaveBeenCalled();
        });

        it('should match suggestion objects by reference', async () => {
            const suggestions = cities();
            const wrapper = mountAutoComplete({ suggestions, modelValue: [suggestions[1], suggestions[4]] });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);
        });

        it('should match suggestion objects held in a reactive modelValue by reference', async () => {
            // Items read from a reactive array are proxies, not the suggestion objects themselves.
            const suggestions = cities();
            const wrapper = mountAutoComplete({ suggestions, modelValue: reactive([suggestions[1], suggestions[4]]) });
            const isEquals = vi.spyOn(wrapper.vm, 'isEquals');

            await openOverlay(wrapper);

            const comparedSuggestions = new Set(isEquals.mock.calls.map(([, optionValue]) => toRaw(optionValue)));

            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);
            // Only the unselected suggestions are compared, since they may still match an equal copy.
            expect([...comparedSuggestions]).toEqual([suggestions[0], suggestions[2], suggestions[3]]);
        });

        it('should match equal copies of suggestion objects by deep equality', async () => {
            // New suggestions arrive as new objects on every search, so this is the usual case without dataKey.
            const wrapper = mountAutoComplete({
                modelValue: [
                    { name: 'Rome', code: 'RM' },
                    { name: 'Paris', code: 'PRS' }
                ]
            });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);
        });

        it('should not match a copy that differs in any field without dataKey', async () => {
            const wrapper = mountAutoComplete({ modelValue: [{ name: 'Rome (copy)', code: 'RM' }] });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual([]);
        });

        it('should match suggestion objects by dataKey only', async () => {
            const wrapper = mountAutoComplete({ dataKey: 'code', modelValue: [{ name: 'Rome (copy)', code: 'RM' }, { code: 'PRS' }] });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);
        });

        it('should not match a typed value against suggestion objects', async () => {
            // Without typeahead, Enter adds the typed text itself to the selection.
            const wrapper = mountAutoComplete({ modelValue: ['Rome', { name: 'Paris', code: 'PRS' }] });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual(['Paris']);
        });

        it('should keep disabled suggestions shown as selected', async () => {
            const suggestions = cities();

            suggestions[1].disabled = true;

            const wrapper = mountAutoComplete({ suggestions, dataKey: 'code', optionDisabled: 'disabled', modelValue: [{ code: 'NY' }, { code: 'RM' }] });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual(['New York', 'Rome']);
        });

        it('should match suggestions inside groups', async () => {
            const wrapper = mountAutoComplete({
                suggestions: [
                    { label: 'Italy', items: ['Milan', 'Rome'] },
                    { label: 'UK', items: ['Leeds', 'London'] }
                ],
                optionLabel: undefined,
                optionGroupLabel: 'label',
                optionGroupChildren: 'items',
                modelValue: ['Rome', 'Leeds']
            });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Leeds']);
        });

        it('should update when modelValue is replaced', async () => {
            const wrapper = mountAutoComplete({ dataKey: 'code', modelValue: [{ code: 'RM' }] });

            await openOverlay(wrapper);
            await wrapper.setProps({ modelValue: [{ code: 'LDN' }, { code: 'IST' }] });

            expect(selectedLabels(wrapper)).toEqual(['London', 'Istanbul']);
        });

        it('should update when the modelValue array is changed in place', async () => {
            const modelValue = reactive(['Rome']);
            const wrapper = mountAutoComplete({ suggestions: cityNames(), optionLabel: undefined, modelValue });

            await openOverlay(wrapper);

            modelValue.push('Paris');
            await nextTick();
            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);

            // Same length, different content: catches lookups that only watch the array length.
            modelValue[0] = 'London';
            await nextTick();
            expect(selectedLabels(wrapper)).toEqual(['London', 'Paris']);

            modelValue.splice(1, 1);
            await nextTick();
            expect(selectedLabels(wrapper)).toEqual(['London']);
        });

        it('should update when the dataKey changes', async () => {
            const wrapper = mountAutoComplete({
                dataKey: 'code',
                modelValue: [
                    { name: 'Rome (copy)', code: 'RM' },
                    { name: 'Paris', code: 'PRS' }
                ]
            });

            await openOverlay(wrapper);
            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);

            await wrapper.setProps({ dataKey: undefined });
            expect(selectedLabels(wrapper)).toEqual(['Paris']);
        });

        it('should update when multiple is toggled', async () => {
            const wrapper = mountAutoComplete({ multiple: false, suggestions: cityNames(), optionLabel: undefined, modelValue: 'Rome' });

            await openOverlay(wrapper);
            expect(selectedLabels(wrapper)).toEqual(['Rome']);

            await wrapper.setProps({ multiple: true, modelValue: ['London'] });
            expect(selectedLabels(wrapper)).toEqual(['London']);
        });

        it('should add an unselected suggestion on click and not add a selected one again', async () => {
            const wrapper = mountAutoComplete({ modelValue: [{ name: 'Rome', code: 'RM' }] });

            await openOverlay(wrapper);
            await wrapper.findAll('li.rs-autocomplete-option')[1].trigger('click');
            expect(wrapper.emitted('update:modelValue')).toBeUndefined();

            await wrapper.findAll('li.rs-autocomplete-option')[4].trigger('click');
            expect(lastEmittedValue(wrapper)).toEqual([{ name: 'Rome', code: 'RM' }, cities()[4]]);
        });

        it('should render the selection correctly with the virtual scroller', async () => {
            const suggestions = Array.from({ length: 1000 }, (_, i) => ({ name: `Item #${i}`, value: i }));
            const modelValue = suggestions.filter((suggestion) => suggestion.value % 2 === 0).map(({ value }) => ({ value }));
            const wrapper = mountAutoComplete({ suggestions, dataKey: 'value', modelValue, virtualScrollerOptions: { itemSize: 38 } });

            await openOverlay(wrapper);

            // jsdom has no layout, so the scroller can't work out its viewport. Set the rendered range by hand,
            // far down the list, as if the user had scrolled there.
            const scroller = wrapper.getComponent(VirtualScroller).vm;

            scroller.first = 900;
            scroller.last = 920;
            await nextTick();

            const rendered = wrapper.findAll('li.rs-autocomplete-option');

            expect(rendered.map((option) => option.attributes('aria-label'))).toEqual(Array.from({ length: 20 }, (_, i) => `Item #${900 + i}`));
            rendered.forEach((option) => {
                const index = Number(option.attributes('aria-posinset')) - 1;

                expect(option.attributes('aria-selected')).toBe(String(index % 2 === 0));
            });
        });
    });

    describe('selected option index', () => {
        it('should return -1 from findSelectedOptionIndex when nothing is selected', () => {
            const wrapper = mountAutoComplete({ dataKey: 'code', modelValue: [] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(-1);
        });

        it('should return the first selected suggestion in suggestion order from findSelectedOptionIndex', () => {
            const wrapper = mountAutoComplete({ suggestions: cityNames(), optionLabel: undefined, modelValue: ['Paris', 'London'] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(2);
        });

        it('should find equal copies in findSelectedOptionIndex without dataKey', () => {
            const wrapper = mountAutoComplete({ modelValue: [{ name: 'Istanbul', code: 'IST' }] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(3);
        });

        it('should skip selected values that match no suggestion in findSelectedOptionIndex', () => {
            const wrapper = mountAutoComplete({ dataKey: 'code', modelValue: [{ code: 'XX' }, { code: 'IST' }] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(3);
        });

        it('should skip disabled suggestions in findSelectedOptionIndex', () => {
            const suggestions = cities();

            suggestions[1].disabled = true;

            const wrapper = mountAutoComplete({ suggestions, dataKey: 'code', optionDisabled: 'disabled', modelValue: [{ code: 'RM' }, { code: 'PRS' }] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(4);
        });

        it('should focus the first selected suggestion on open with autoOptionFocus', async () => {
            const wrapper = mountAutoComplete({ dataKey: 'code', modelValue: [{ code: 'PRS' }, { code: 'RM' }], autoOptionFocus: true });

            await openOverlay(wrapper);

            expect(wrapper.vm.focusedOptionIndex).toBe(1);
        });

        it('should find the next and previous selected suggestions', () => {
            const wrapper = mountAutoComplete({ suggestions: cityNames(), optionLabel: undefined, modelValue: ['New York', 'Istanbul'] });

            expect(wrapper.vm.findNextSelectedOptionIndex(1)).toBe(3);
            expect(wrapper.vm.findNextSelectedOptionIndex(3)).toBe(-1);
            expect(wrapper.vm.findPrevSelectedOptionIndex(3)).toBe(0);
            expect(wrapper.vm.findPrevSelectedOptionIndex(0)).toBe(-1);
        });
    });

    describe('range selection', () => {
        it('should select a range up to the nearest selected suggestion', () => {
            const wrapper = mountAutoComplete({ suggestions: cityNames(), optionLabel: undefined, modelValue: ['Rome'] });

            wrapper.vm.onOptionSelectRange(new KeyboardEvent('keydown'), -1, 3);

            expect(lastEmittedValue(wrapper)).toEqual(['Rome', 'London', 'Istanbul']);
        });

        it('should select a range down to the nearest selected suggestion', () => {
            const wrapper = mountAutoComplete({ suggestions: cityNames(), optionLabel: undefined, modelValue: ['Istanbul'] });

            wrapper.vm.onOptionSelectRange(new KeyboardEvent('keydown'), 0, -1);

            expect(lastEmittedValue(wrapper)).toEqual(['Istanbul', 'New York', 'Rome', 'London']);
        });

        it('should not compare each suggestion against every selected value when selecting a range or focusing on open', async () => {
            const wrapper = mountAutoComplete({ dataKey: 'code', modelValue: [{ code: 'LDN' }, { code: 'PRS' }], autoOptionFocus: true });
            const isEquals = vi.spyOn(wrapper.vm, 'isEquals');

            await openOverlay(wrapper);
            expect(wrapper.vm.focusedOptionIndex).toBe(2);

            wrapper.vm.onOptionSelectRange(new KeyboardEvent('keydown'), -1, 0);
            expect(lastEmittedValue(wrapper)).toEqual([{ code: 'LDN' }, { code: 'PRS' }, cities()[0], cities()[1]]);
            expect(isEquals).not.toHaveBeenCalled();
        });

        it('should not add suggestions selected by dataKey again', () => {
            const suggestions = cities();
            const wrapper = mountAutoComplete({ suggestions, dataKey: 'code', modelValue: [{ code: 'RM' }, { code: 'LDN' }] });

            wrapper.vm.onOptionSelectRange(new KeyboardEvent('keydown'), 0, 3);

            expect(lastEmittedValue(wrapper)).toEqual([{ code: 'RM' }, { code: 'LDN' }, suggestions[0], suggestions[3]]);
        });

        it('should not add equal copies of selected suggestions again without dataKey', () => {
            const suggestions = cities();
            const wrapper = mountAutoComplete({ suggestions, modelValue: [{ name: 'Rome', code: 'RM' }] });

            wrapper.vm.onOptionSelectRange(new KeyboardEvent('keydown'), -1, 3);

            expect(lastEmittedValue(wrapper)).toEqual([{ name: 'Rome', code: 'RM' }, suggestions[2], suggestions[3]]);
        });

        it('should skip disabled suggestions in a range', () => {
            const suggestions = cities();

            suggestions[2].disabled = true;

            const wrapper = mountAutoComplete({ suggestions, dataKey: 'code', optionDisabled: 'disabled', modelValue: [] });

            wrapper.vm.onOptionSelectRange(new KeyboardEvent('keydown'), 1, 3);

            expect(lastEmittedValue(wrapper)).toEqual([suggestions[1], suggestions[3]]);
        });
    });

    describe('overridden isEquals', () => {
        // A component that extends AutoComplete with its own equality rule, here case-insensitive values.
        const CaseInsensitiveAutoComplete = defineComponent({
            extends: AutoComplete,
            render: AutoComplete.render,
            methods: {
                isEquals(value1: unknown, value2: unknown) {
                    return String(value1).toLowerCase() === String(value2).toLowerCase();
                }
            }
        });

        const mountCaseInsensitive = (props: AutoCompleteProps) =>
            mountAutoComplete({ suggestions: cityNames(), optionLabel: undefined, ...props }, CaseInsensitiveAutoComplete);

        it('should use the overridden isEquals to show selected suggestions', async () => {
            const wrapper = mountCaseInsensitive({ modelValue: ['rome', 'PARIS'] });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);
        });

        it('should use the overridden isEquals in findSelectedOptionIndex and range selection', () => {
            const wrapper = mountCaseInsensitive({ modelValue: ['london'] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(2);

            wrapper.vm.onOptionSelectRange(new KeyboardEvent('keydown'), -1, 4);
            expect(lastEmittedValue(wrapper)).toEqual(['london', 'Istanbul', 'Paris']);
        });
    });

    describe('single selection', () => {
        it('should match a primitive value', async () => {
            const wrapper = mountAutoComplete({ multiple: false, suggestions: cityNames(), optionLabel: undefined, modelValue: 'Rome' });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual(['Rome']);
        });

        it('should match an equal copy of a suggestion object', async () => {
            const wrapper = mountAutoComplete({ multiple: false, modelValue: { name: 'Rome', code: 'RM' } });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual(['Rome']);
        });
    });
});
