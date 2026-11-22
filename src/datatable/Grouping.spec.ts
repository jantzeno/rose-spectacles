import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Column from '../column/Column.vue';
import PrimeVue from '../config/Config';
import DataTable from './DataTable.vue';

const rows = [
    { id: '1', representative: { name: 'Amy' }, name: 'Alice', status: 'Ready' },
    { id: '2', representative: { name: 'Amy' }, name: 'Alice', status: 'Ready' },
    { id: '3', representative: { name: 'Amy' }, name: 'Clara', status: 'Ready' },
    { id: '4', representative: { name: 'Amy' }, name: 'Clara', status: 'Queued' },
    { id: '5', representative: { name: 'John' }, name: 'Alice', status: 'Queued' },
    { id: '6', representative: { name: 'John' }, name: 'Alice', status: 'Ready' }
];

const mountTable = (props: InstanceType<typeof DataTable>['$props'], columns = '<Column field="id" header="ID" /><Column field="representative.name" />') =>
    mount(DataTable, {
        props: { value: rows, dataKey: 'id', ...props },
        global: { plugins: [PrimeVue], components: { Column } },
        slots: {
            default: columns,
            groupheader: '<template #groupheader="{ data }">{{ data.representative.name }}/{{ data.name }}</template>',
            groupfooter: '<template #groupfooter="{ data }">{{ data.representative.name }}/{{ data.name }}</template>',
            expansion: '<template #expansion="{ data }">Details for {{ data.id }}</template>'
        }
    });

it('groups a one-element array of nested fields like the scalar field', async () => {
    const table = mountTable({ rowGroupMode: 'subheader', groupRowsBy: 'representative.name', expandableRowGroups: true, expandedRowGroups: ['Amy'] });

    try {
        const body = table.get('tbody').text();

        await table.setProps({ groupRowsBy: ['representative.name'] });

        expect(table.findAll('thead th').map((header) => header.text())).toEqual(['ID']);
        expect(table.get('tbody').text()).toBe(body);
        await table.get('.rs-datatable-row-group-header button').trigger('click');
        expect(table.emitted('update:expandedRowGroups')).toEqual([[[]]]);
    } finally {
        table.unmount();
    }
});

it('renders and expands distinct combinations of subheader grouping fields', async () => {
    const table = mountTable(
        {
            value: [rows[0], rows[2], rows[1], rows[4], rows[3], rows[5]],
            rowGroupMode: 'subheader',
            groupRowsBy: ['representative.name', 'name'],
            sortField: 'representative.name',
            sortOrder: 1,
            expandableRowGroups: true,
            expandedRowGroups: [['Amy', 'Clara']]
        },
        '<Column field="id" header="ID" /><Column field="representative.name" header="Representative" /><Column field="name" header="Name" />'
    );

    try {
        const headers = table.findAll('.rs-datatable-row-group-header');
        const footers = table.findAll('.rs-datatable-row-group-footer');

        expect(headers.map((header) => header.text())).toEqual(['Amy/Alice', 'Amy/Clara', 'John/Alice']);
        expect(footers.map((footer) => footer.text())).toEqual(['Amy/Clara']);
        expect(table.findAll('tbody tr[data-p-index]').map((row) => row.text())).toEqual(['3', '4']);
        expect(table.findAll('thead th').map((header) => header.text())).toEqual(['ID']);
        expect(headers[0].get('td').attributes('colspan')).toBe('1');
        await headers[0].get('button').trigger('click');
        expect(table.emitted('update:expandedRowGroups')).toEqual([
            [
                [
                    ['Amy', 'Clara'],
                    ['Amy', 'Alice']
                ]
            ]
        ]);
        await headers[1].get('button').trigger('click');
        expect(table.emitted('update:expandedRowGroups')?.[1]).toEqual([[]]);
    } finally {
        table.unmount();
    }
});

it('uses the replacement group sort and retains it when sorting inside the new groups', async () => {
    const table = mountTable(
        { rowGroupMode: 'subheader', groupRowsBy: 'status', sortMode: 'multiple', multiSortMeta: [{ field: 'status', order: 1 }] },
        '<Column field="id" header="ID" sortable /><Column field="status" /><Column field="representative.name" />'
    );

    try {
        const renderedIds = () => table.findAll('tbody tr[data-p-index]').map((row) => row.get('td').text());

        expect(renderedIds()).toEqual(['4', '5', '1', '2', '3', '6']);
        await table.setProps({
            groupRowsBy: 'representative.name',
            multiSortMeta: [
                { field: 'representative.name', order: 1 },
                { field: 'id', order: -1 }
            ]
        });
        expect(renderedIds()).toEqual(['4', '3', '2', '1', '6', '5']);
        await table.get('thead th').trigger('click');
        expect(renderedIds()).toEqual(['1', '2', '3', '4', '5', '6']);
        expect(table.emitted('update:multiSortMeta')).toEqual([
            [
                [
                    { field: 'representative.name', order: 1 },
                    { field: 'id', order: 1 }
                ]
            ]
        ]);
    } finally {
        table.unmount();
    }
});

it('ends rowspans at full-width expansion rows and resumes them on the next record', async () => {
    const table = mountTable(
        { rowGroupMode: 'rowspan', groupRowsBy: 'representative.name', expandedRows: { '2': true } },
        '<Column expander /><Column field="representative.name" /><Column field="id" />'
    );

    try {
        const spans = () => table.findAll('tbody td[rowspan]').map((cell) => [cell.text(), cell.attributes('rowspan')]);

        expect(spans()).toEqual([
            ['Amy', '2'],
            ['Amy', '2'],
            ['John', '2']
        ]);
        const details = table.get('.rs-datatable-row-expansion td');
        expect(details.text()).toBe('Details for 2');
        expect(details.attributes('colspan')).toBe('3');
        expect(table.findAll('tbody tr[data-p-index]').map((row) => row.findAll('td').length)).toEqual([3, 2, 3, 2, 3, 2]);
        await table.setProps({ expandedRows: {} });
        expect(spans()).toEqual([
            ['Amy', '4'],
            ['John', '2']
        ]);
        expect(table.find('.rs-datatable-row-expansion').exists()).toBe(false);
    } finally {
        table.unmount();
    }
});

it('groups rowspans within a virtual window that begins inside an existing group', async () => {
    const table = mountTable({ rowGroupMode: 'rowspan', groupRowsBy: 'representative.name', scrollable: true, virtualScrollerOptions: { itemSize: 36 } });

    try {
        const scroller = table.findComponent({ name: 'VirtualScroller' });

        scroller.vm.first = 2;
        scroller.vm.last = 6;
        await nextTick();

        expect(table.findAll('tbody tr[data-p-index]').map((row) => row.attributes('data-p-index'))).toEqual(['2', '3', '4', '5']);
        expect(table.findAll('tbody td[rowspan]').map((cell) => [cell.text(), cell.attributes('rowspan')])).toEqual([
            ['Amy', '2'],
            ['John', '2']
        ]);
    } finally {
        table.unmount();
    }
});
