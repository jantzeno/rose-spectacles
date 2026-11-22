import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Column from '../column/Column.vue';
import { FilterMatchMode } from '../core/api/Api';
import DataTable from './DataTable.vue';
import type { DataTableRowEditSaveEvent } from './DataTable';

type Item = { id: number; name: string; rank: number };

function editingTable(props: {
    value: Item[];
    frozenValue?: Item[];
    dataKey?: string;
    editMode: 'row' | 'cell';
    sortField?: string;
    sortOrder?: number;
    filters?: Record<string, { value: string; matchMode: string }>;
}) {
    const wrapper = mount(DataTable, {
        attachTo: document.body,
        props: {
            ...props,
            scrollable: !!props.frozenValue,
            editingRows: [],
            'onUpdate:editingRows': (rows: Item[]) => void wrapper.setProps({ editingRows: rows }),
            onRowEditSave: ({ data, newData }: DataTableRowEditSaveEvent<Item>) => {
                const source = wrapper.props('value') as Item[];
                void wrapper.setProps({ value: source.map((item) => (item.id === data.id ? newData : item)) });
            }
        },
        slots: {
            default: () => [
                h(Column, { field: 'id' }, { body: ({ data }: { data: Item }) => h('span', { 'data-row-id': '' }, String(data.id)) }),
                h(
                    Column,
                    { field: 'name' },
                    {
                        body: ({ data }: { data: Item }) => data.name,
                        editor: ({ data }: { data: Item }) =>
                            h('input', {
                                'aria-label': 'Name',
                                value: data.name,
                                onInput: (event: Event) => (data.name = (event.target as HTMLInputElement).value)
                            })
                    }
                ),
                h(
                    Column,
                    { field: 'rank' },
                    {
                        editor: ({ data }: { data: Item }) =>
                            h('input', {
                                'aria-label': 'Rank',
                                value: data.rank,
                                onInput: (event: Event) => (data.rank = Number((event.target as HTMLInputElement).value))
                            })
                    }
                ),
                ...(props.editMode === 'row' ? [h(Column, { rowEditor: true })] : [])
            ]
        }
    });

    const row = (id: number) => wrapper.findAll('tbody tr').find((entry) => entry.find('[data-row-id]').text() === String(id))!;

    return { wrapper, row };
}

it.each([
    [1, 2],
    [2, 1]
])('keeps frozen and scrollable row drafts separate when editing row %i before row %i', async (first, second) => {
    const { wrapper } = editingTable({
        value: [{ id: 2, name: 'Regular', rank: 1 }],
        frozenValue: [{ id: 1, name: 'Frozen', rank: 1 }],
        dataKey: 'id',
        editMode: 'row'
    });

    try {
        const sections = wrapper.findAll('tbody');
        const firstSection = sections[first - 1];
        const secondSection = sections[second - 1];
        await firstSection.get('.rs-datatable-row-editor-init').trigger('click');
        await firstSection.get<HTMLInputElement>('input[aria-label="Name"]').setValue('First draft');
        await secondSection.get('.rs-datatable-row-editor-init').trigger('click');

        expect(secondSection.get<HTMLInputElement>('input[aria-label="Name"]').element.value).toBe(second === 1 ? 'Frozen' : 'Regular');
        expect(firstSection.get<HTMLInputElement>('input[aria-label="Name"]').element.value).toBe('First draft');
    } finally {
        wrapper.unmount();
    }
});

it('retains a filtered-out draft until the registered row edit closes', async () => {
    const copper = { id: 1, name: 'Copper', rank: 1 };
    const tin = { id: 2, name: 'Tin', rank: 2 };
    const filterByName = (value: string) => ({ name: { value, matchMode: FilterMatchMode.STARTS_WITH } });
    const { wrapper, row } = editingTable({ value: [copper, tin], dataKey: 'id', editMode: 'row', filters: filterByName('') });

    try {
        await row(2).get('.rs-datatable-row-editor-init').trigger('click');
        await row(2).get<HTMLInputElement>('input[aria-label="Name"]').setValue('Tin draft');
        await wrapper.setProps({ filters: filterByName('C') });
        expect(wrapper.findAll('[data-row-id]').map((cell) => cell.text())).toEqual(['1']);

        await wrapper.setProps({ filters: filterByName('') });
        expect(row(2).get<HTMLInputElement>('input[aria-label="Name"]').element.value).toBe('Tin draft');

        await wrapper.setProps({ filters: filterByName('C') });
        await wrapper.setProps({ editingRows: [], filters: filterByName('') });
        await row(2).get('.rs-datatable-row-editor-init').trigger('click');
        expect(row(2).get<HTMLInputElement>('input[aria-label="Name"]').element.value).toBe('Tin');
    } finally {
        wrapper.unmount();
    }
});

it.each(['sort', 'filter'])('preserves a second row draft after saving the first with %s active', async (mode) => {
    const items = [
        { id: 1, name: 'Copper', rank: 1 },
        { id: 2, name: 'Cobalt', rank: 2 },
        { id: 3, name: 'Chrome', rank: 3 }
    ];
    const { wrapper, row } = editingTable({
        value: items,
        dataKey: 'id',
        editMode: 'row',
        ...(mode === 'sort' ? { sortField: 'rank', sortOrder: 1 } : { filters: { name: { value: 'C', matchMode: FilterMatchMode.STARTS_WITH } } })
    });

    try {
        await row(1).get('.rs-datatable-row-editor-init').trigger('click');
        await row(2).get('.rs-datatable-row-editor-init').trigger('click');
        await row(1).get<HTMLInputElement>('input[aria-label="Rank"]').setValue('4');
        await row(2).get<HTMLInputElement>('input[aria-label="Name"]').setValue('Cobalt draft');
        await row(1).get('.rs-datatable-row-editor-save').trigger('click');

        expect(wrapper.props('value')).toEqual([{ ...items[0], rank: 4 }, items[1], items[2]]);
        expect(row(2).get<HTMLInputElement>('input[aria-label="Name"]').element.value).toBe('Cobalt draft');
        if (mode === 'sort') expect(wrapper.findAll('[data-row-id]').map((cell) => cell.text())).toEqual(['2', '3', '1']);

        await row(2).get('.rs-datatable-row-editor-cancel').trigger('click');
        expect(row(2).text()).toContain('Cobalt');
        expect(row(2).text()).not.toContain('Cobalt draft');
    } finally {
        wrapper.unmount();
    }
});

it('inserts a distinct row before an edited row without reusing its draft', async () => {
    const copper = { id: 1, name: 'Copper', rank: 1 };
    const tin = { id: 2, name: 'Tin', rank: 2 };
    const { wrapper, row } = editingTable({ value: [copper, tin], editMode: 'row' });

    try {
        await row(1).get('.rs-datatable-row-editor-init').trigger('click');
        await row(1).get<HTMLInputElement>('input[aria-label="Name"]').setValue('Copper draft');
        await wrapper.setProps({ value: [{ id: 3, name: 'Zinc', rank: 3 }, copper, tin] });

        expect(wrapper.findAll('[data-row-id]').map((cell) => cell.text())).toEqual(['3', '1', '2']);
        expect(row(3).text()).toContain('Zinc');
        expect(row(1).get<HTMLInputElement>('input[aria-label="Name"]').element.value).toBe('Copper draft');
    } finally {
        wrapper.unmount();
    }
});

it('follows the edited cell when object rows move without a data key', async () => {
    const copper = { id: 1, name: 'Copper', rank: 1 };
    const tin = { id: 2, name: 'Tin', rank: 2 };
    const { wrapper, row } = editingTable({ value: [copper, tin], editMode: 'cell' });

    try {
        await row(1).findAll('td')[1].trigger('click');
        await row(1).get<HTMLInputElement>('input[aria-label="Name"]').setValue('Copper draft');
        await wrapper.setProps({ value: [tin, copper] });

        expect(row(2).find('input').exists()).toBe(false);
        expect(row(1).get<HTMLInputElement>('input[aria-label="Name"]').element.value).toBe('Copper draft');
        await row(1).get<HTMLInputElement>('input[aria-label="Name"]').trigger('keydown', { code: 'Enter' });
        expect(wrapper.emitted('cell-edit-complete')).toEqual([[expect.objectContaining({ data: copper, newValue: 'Copper draft' })]]);
    } finally {
        wrapper.unmount();
    }
});

it('creates an isolated row draft when switching modes with the same row still editing', async () => {
    const copper = { id: 1, name: 'Copper', rank: 1 };
    const wrapper = mount(DataTable, {
        props: { value: [copper], dataKey: 'id', editMode: 'cell' },
        global: { components: { Column } },
        slots: {
            default: '<Column field="name"><template #editor="{ data, field }"><input v-model="data[field]" /></template></Column>'
        }
    });

    try {
        await wrapper.get('tbody td').trigger('click');
        await wrapper.get('input').setValue('Copper cell draft');

        await wrapper.setProps({ editMode: 'row', editingRows: [copper] });
        const editor = wrapper.get('input');
        expect(editor.element.value).toBe('Copper');
        await editor.setValue('Copper row draft');
        expect(wrapper.props('value')).toEqual([{ id: 1, name: 'Copper', rank: 1 }]);
    } finally {
        wrapper.unmount();
    }
});

it('uses the scrollable cell value when entering it from a frozen row', async () => {
    const { wrapper, row } = editingTable({
        value: [{ id: 2, name: 'Regular', rank: 1 }],
        frozenValue: [{ id: 1, name: 'Frozen', rank: 1 }],
        dataKey: 'id',
        editMode: 'cell'
    });

    try {
        await row(1).findAll('td')[1].trigger('click');
        await row(1).get<HTMLInputElement>('input[aria-label="Name"]').setValue('Frozen draft');

        const regular = row(2).findAll('td')[1];
        regular.element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        regular.element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await nextTick();

        expect(regular.get<HTMLInputElement>('input[aria-label="Name"]').element.value).toBe('Regular');
    } finally {
        wrapper.unmount();
    }
});
