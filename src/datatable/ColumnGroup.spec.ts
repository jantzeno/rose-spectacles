import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Column from '../column/Column.vue';
import ColumnGroup from '../columngroup/ColumnGroup.vue';
import Row from '../row/Row.vue';
import DataTable from './DataTable.vue';

it('renders a grouped header whose render-function slot returns one row', () => {
    const table = mount({
        render: () =>
            h(
                DataTable,
                { value: [{ city: 'Oslo' }] },
                {
                    default: () => [
                        h(ColumnGroup, { type: 'header' }, { default: () => h(Row, {}, { default: () => h(Column, { header: 'City' }) }) }),
                        h(Column, { field: 'city' })
                    ]
                }
            )
    });

    try {
        expect(table.get('thead').text()).toBe('City');
        expect(table.get('tbody').text()).toBe('Oslo');
    } finally {
        table.unmount();
    }
});

it('aligns frozen grouped headers with columns occupied by an earlier rowspan', async () => {
    const width = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(120);
    const table = mount(DataTable, {
        props: { value: [{ id: '1', name: 'Copper', status: 'Ready', country: 'Norway' }], scrollable: true },
        global: { components: { Column, ColumnGroup, Row } },
        slots: {
            default: `
                <ColumnGroup type="header">
                    <Row>
                        <Column header="ID" :rowspan="2" frozen />
                        <Column header="Record" :colspan="2" frozen />
                        <Column header="Region" />
                    </Row>
                    <Row>
                        <Column header="Name" frozen />
                        <Column header="Status" frozen />
                        <Column header="Country" />
                    </Row>
                </ColumnGroup>
                <Column field="id" frozen />
                <Column field="name" frozen />
                <Column field="status" frozen />
                <Column field="country" />
            `
        }
    });

    try {
        await nextTick();
        const headers = table.findAll<HTMLTableCellElement>('thead tr:last-child th[data-p-frozen-column="true"]');
        const cells = table.findAll<HTMLTableCellElement>('tbody td[data-p-frozen-column="true"]').slice(1);

        expect(headers.map((header) => header.text())).toEqual(['Name', 'Status']);
        expect(cells.map((cell) => cell.element.style.insetInlineStart)).toEqual(['120px', '240px']);
        expect(headers.map((header) => header.element.style.insetInlineStart)).toEqual(['120px', '240px']);
    } finally {
        table.unmount();
        width.mockRestore();
    }
});
