import assert from 'node:assert/strict';
import { mount } from '@vue/test-utils';
import { h, nextTick, ref, type Component } from 'vue';
import AutoComplete from '../autocomplete/AutoComplete.vue';
import Column from '../column/Column.vue';
import DatePicker from '../datepicker/DatePicker.vue';
import MultiSelect from '../multiselect/MultiSelect.vue';
import Select from '../select/Select.vue';
import DataTable from './DataTable.vue';

const choices = ['IT', 'Board gaming', 'Tennis'];

function getElement(selector: string) {
    const element = document.querySelector<HTMLElement>(selector);
    assert(element, `Missing ${selector}`);
    return element;
}

async function click(element: HTMLElement) {
    element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    await nextTick();
    await vi.runAllTimersAsync();
}

function mountEditor(component: Component, initial: unknown, props: Record<string, unknown> = {}) {
    const suggestions = ref<string[]>([]);
    const wrapper = mount(DataTable, {
        attachTo: document.body,
        props: { value: [{ id: 1, choice: initial }], editMode: 'cell' },
        global: { stubs: { teleport: false } },
        slots: {
            default: () =>
                h(
                    Column,
                    { field: 'choice' },
                    {
                        editor: ({ data }: { data: { choice: unknown } }) =>
                            h(component, {
                                ...props,
                                modelValue: data.choice,
                                'onUpdate:modelValue': (value: unknown) => (data.choice = value),
                                ...(component === AutoComplete ? { suggestions: suggestions.value, onComplete: () => (suggestions.value = choices) } : {})
                            })
                    }
                )
        }
    });

    return wrapper;
}

beforeEach(() => {
    vi.useFakeTimers();
});
afterEach(() => {
    vi.useRealTimers();
});

it('keeps a portalled Select filter and its cell editor open while filtering', async () => {
    const wrapper = mountEditor(Select, 'IT', { options: choices, filter: true });

    try {
        await wrapper.get('tbody td').trigger('click');
        await click(wrapper.get<HTMLElement>('.rs-select').element);
        const filter = getElement('.rs-select-overlay [role="searchbox"]') as HTMLInputElement;
        await click(filter);
        filter.focus();
        filter.value = 'Tennis';
        filter.dispatchEvent(new Event('input', { bubbles: true }));
        await nextTick();
        await vi.runAllTimersAsync();

        expect(document.activeElement).toBe(filter);
        expect(document.querySelectorAll('.rs-select-overlay [role="option"]')).toHaveLength(1);
        expect(wrapper.emitted('cell-edit-complete')).toBeUndefined();
        expect(wrapper.get('tbody td').attributes('data-p-cell-editing')).toBe('true');
    } finally {
        wrapper.unmount();
    }
});

it('allows several portalled MultiSelect pointer choices before an outside click commits the cell', async () => {
    const wrapper = mountEditor(MultiSelect, ['IT'], { options: choices });

    try {
        await wrapper.get('tbody td').trigger('click');
        await click(wrapper.get<HTMLElement>('.rs-multiselect').element);
        await click(getElement('.rs-multiselect-overlay [aria-label="Board gaming"]'));
        await click(getElement('.rs-multiselect-overlay [aria-label="Tennis"]'));

        expect(wrapper.emitted('cell-edit-complete')).toBeUndefined();
        await click(document.body);
        expect(wrapper.emitted('cell-edit-complete')).toEqual([[expect.objectContaining({ newValue: choices })]]);
    } finally {
        wrapper.unmount();
    }
});

it('leaves the cell open when MultiSelect handles Enter to open or select', async () => {
    const wrapper = mountEditor(MultiSelect, [], { options: choices });

    try {
        await wrapper.get('tbody td').trigger('click');
        const input = wrapper.get<HTMLElement>('[role="combobox"]');
        await input.trigger('keydown', { code: 'Enter', key: 'Enter' });
        expect(wrapper.emitted('cell-edit-complete')).toBeUndefined();
        expect(input.attributes('aria-expanded')).toBe('true');
        await input.trigger('keydown', { code: 'ArrowDown', key: 'ArrowDown' });
        await input.trigger('keydown', { code: 'Enter', key: 'Enter' });

        expect(wrapper.emitted('cell-edit-complete')).toBeUndefined();
        expect(input.attributes('aria-expanded')).toBe('true');

        await click(document.body);
        expect(wrapper.emitted('cell-edit-complete')?.[0]?.[0]).toMatchObject({ newValue: [choices[0]] });
    } finally {
        wrapper.unmount();
    }
});

it('stores an AutoComplete pointer selection before committing the edited cell', async () => {
    const wrapper = mountEditor(AutoComplete, '', { delay: 0 });

    try {
        await wrapper.get('tbody td').trigger('click');
        await wrapper.get('input').setValue('Ten');
        await vi.runAllTimersAsync();
        await click(getElement('.rs-autocomplete-overlay [aria-label="Tennis"]'));

        expect(wrapper.emitted('cell-edit-complete')).toBeUndefined();
        await click(document.body);
        expect(wrapper.emitted('cell-edit-complete')).toEqual([[expect.objectContaining({ newValue: 'Tennis' })]]);
    } finally {
        wrapper.unmount();
    }
});

it('selects a date from the portalled calendar before committing the edited cell', async () => {
    const wrapper = mountEditor(DatePicker, new Date(2026, 5, 1));

    try {
        await wrapper.get('tbody td').trigger('click');
        await wrapper.get('input').trigger('focus');
        await click(getElement('.rs-datepicker-panel td[aria-label="15"] [data-pc-section="day"]'));

        expect(wrapper.emitted('cell-edit-complete')).toBeUndefined();
        await click(document.body);
        expect(wrapper.emitted('cell-edit-complete')).toEqual([[expect.objectContaining({ newValue: new Date(2026, 5, 15) })]]);
    } finally {
        wrapper.unmount();
    }
});

it('opens only the next DatePicker when moving quickly between date cells', async () => {
    const wrapper = mount(DataTable, {
        attachTo: document.body,
        props: { value: [{ start: new Date(2026, 5, 1), end: new Date(2026, 6, 1) }], editMode: 'cell' },
        global: { components: { Column, DatePicker }, stubs: { teleport: false } },
        slots: {
            default: `
                <Column field="start"><template #editor="{ data }"><DatePicker v-model="data.start" /></template></Column>
                <Column field="end"><template #editor="{ data }"><DatePicker v-model="data.end" /></template></Column>
            `
        }
    });

    try {
        const [start, end] = wrapper.findAll('tbody td');
        await start.trigger('click');
        await start.get('input').trigger('focus');
        const startDay = getElement('.rs-datepicker-panel td[aria-label="15"] [data-pc-section="day"]');
        startDay.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        startDay.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await nextTick();

        end.element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        end.element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await nextTick();
        await end.get('input').trigger('focus');
        await vi.runAllTimersAsync();

        expect(document.querySelectorAll('.rs-datepicker-panel')).toHaveLength(1);
        expect(start.find('input').exists()).toBe(false);
        await click(getElement('.rs-datepicker-panel td[aria-label="20"] [data-pc-section="day"]'));
        await click(document.body);

        expect(wrapper.emitted('cell-edit-complete')).toEqual([
            [expect.objectContaining({ field: 'start', newValue: new Date(2026, 5, 15) })],
            [expect.objectContaining({ field: 'end', newValue: new Date(2026, 6, 20) })]
        ]);
    } finally {
        wrapper.unmount();
    }
});

it('commits the cell when a pointer interaction belongs to another overlay', async () => {
    const wrapper = mountEditor(Select, 'IT', { options: choices });
    const outside = document.createElement('button');
    outside.dataset.pcSection = 'overlay';
    document.body.append(outside);

    try {
        await wrapper.get('tbody td').trigger('click');
        await click(outside);

        expect(wrapper.emitted('cell-edit-complete')).toEqual([[expect.objectContaining({ newValue: 'IT' })]]);
        expect(wrapper.get('tbody td').attributes('data-p-cell-editing')).toBe('false');
    } finally {
        outside.remove();
        wrapper.unmount();
    }
});
