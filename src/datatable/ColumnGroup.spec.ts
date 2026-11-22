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

it.each([
    { mode: 'expand', header: 'Price', widths: [120, 150, 120, 120], tableWidth: '510px' },
    { mode: 'expand', header: 'Details', widths: [120, 120, 150, 120], tableWidth: '510px' },
    { mode: 'fit', header: 'Quantity', widths: [120, 120, 150, 90], tableWidth: '' }
] as const)('resizes the logical column at the $header header edge in $mode mode', async ({ mode, header, widths, tableWidth }) => {
    const width = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (this: HTMLElement) {
        return this.tagName === 'TABLE' ? 480 : 120;
    });
    const table = mount(DataTable, {
        attachTo: document.body,
        props: {
            value: [{ product: 'Copper', price: 20, quantity: 3, notes: 'Available' }],
            resizableColumns: true,
            columnResizeMode: mode
        },
        global: { components: { Column, ColumnGroup, Row } },
        slots: {
            default: `
                <ColumnGroup type="header">
                    <Row>
                        <Column header="Product" :rowspan="2" />
                        <Column header="Details" :colspan="2" />
                        <Column header="Notes" :rowspan="2" />
                    </Row>
                    <Row>
                        <Column header="Price" />
                        <Column header="Quantity" />
                    </Row>
                </ColumnGroup>
                <Column field="product" />
                <Column field="price" />
                <Column field="quantity" />
                <Column field="notes" />
            `
        }
    });

    try {
        const cell = table.findAll('th').find((cell) => cell.text() === header)!;

        if (mode === 'fit') {
            expect(
                table
                    .findAll('th')
                    .find((cell) => cell.text() === 'Notes')!
                    .find('.rs-datatable-column-resizer')
                    .exists()
            ).toBe(false);
        }

        cell.get('.rs-datatable-column-resizer').element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 150 }));
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 180 }));
        document.dispatchEvent(new MouseEvent('mouseup', { clientX: 180 }));
        await nextTick();

        expect(table.findAll<HTMLTableColElement>('colgroup col').map((column) => column.element.style.width)).toEqual(widths.map((width) => `${width}px`));
        expect(table.get('table').element.style.width).toBe(tableWidth);
        expect(table.emitted('column-resize-end')).toEqual([[{ element: cell.element, delta: 30 }]]);
    } finally {
        table.unmount();
        width.mockRestore();
    }
});

it('reorders grouped headers and body columns while preserving merged groups', async () => {
    const stateKey = 'grouped-columns';
    const mountTable = () =>
        mount(DataTable, {
            props: {
                value: [{ product: 'Copper', price: 20, quantity: 3, warehouse: 'North', stock: 40 }],
                reorderableColumns: true,
                stateKey,
                stateStorage: 'session'
            },
            global: { components: { Column, ColumnGroup, Row } },
            slots: {
                default: `
                <ColumnGroup type="header">
                    <Row>
                        <Column header="Product" :rowspan="2" />
                        <Column header="Purchasing" :colspan="2" />
                        <Column header="Inventory" :colspan="2" />
                    </Row>
                    <Row>
                        <Column header="Price" />
                        <Column header="Quantity" />
                        <Column header="Warehouse" />
                        <Column header="Stock" />
                    </Row>
                </ColumnGroup>
                <Column field="product" />
                <Column field="price" />
                <Column field="quantity" />
                <Column field="warehouse" />
                <Column field="stock" />
                <ColumnGroup type="footer">
                    <Row>
                        <Column footer="Product total" :rowspan="2" />
                        <Column footer="Purchasing totals" :colspan="2" />
                        <Column footer="Inventory totals" :colspan="2" />
                    </Row>
                    <Row>
                        <Column footer="Price total" />
                        <Column footer="Quantity total" />
                        <Column footer="Warehouse total" />
                        <Column footer="Stock total" />
                    </Row>
                </ColumnGroup>
            `
            }
        });
    let table = mountTable();

    const body = () => table.findAll('tbody td').map((cell) => cell.text());
    const footer = () => table.findAll('tfoot tr:first-child td').map((cell) => cell.text());

    async function dropAfter(source: string, target: string) {
        const from = table.findAll('th').find((cell) => cell.text() === source)!;
        const to = table.findAll('th').find((cell) => cell.text() === target)!;
        const event = { dataTransfer: { setData: vi.fn() }, clientX: 10 };

        await from.trigger('mousedown');
        await from.trigger('dragstart', event);
        await to.trigger('dragover', event);
        await to.trigger('drop', event);
    }

    try {
        await dropAfter('Price', 'Quantity');
        expect(table.findAll('thead tr:last-child th').map((cell) => cell.text())).toEqual(['Quantity', 'Price', 'Warehouse', 'Stock']);
        expect(body()).toEqual(['Copper', '3', '20', 'North', '40']);
        expect(table.findAll('tfoot tr:last-child td').map((cell) => cell.text())).toEqual(['Quantity total', 'Price total', 'Warehouse total', 'Stock total']);

        await dropAfter('Product', 'Stock');
        expect(table.findAll('thead tr:first-child th').map((cell) => cell.text())).toEqual(['Purchasing', 'Inventory', 'Product']);
        expect(body()).toEqual(['3', '20', 'North', '40', 'Copper']);
        expect(footer()).toEqual(['Purchasing totals', 'Inventory totals', 'Product total']);
        expect(table.emitted('column-reorder')?.map(([event]) => event)).toMatchObject([
            { dragIndex: 1, dropIndex: 2 },
            { dragIndex: 0, dropIndex: 4 }
        ]);

        table.unmount();
        table = mountTable();
        await nextTick();
        expect(body()).toEqual(['3', '20', 'North', '40', 'Copper']);
        expect(footer()).toEqual(['Purchasing totals', 'Inventory totals', 'Product total']);

        table.unmount();
        window.sessionStorage.setItem(stateKey, JSON.stringify({ columnOrder: ['product', 'quantity', 'warehouse', 'price', 'stock'] }));
        table = mountTable();
        await nextTick();
        expect(body()).toEqual(['Copper', '20', '3', 'North', '40']);
        expect(footer()).toEqual(['Product total', 'Purchasing totals', 'Inventory totals']);
    } finally {
        table.unmount();
        window.sessionStorage.removeItem(stateKey);
    }
});

it('preserves the single selection column when a flat column moves ahead of it', async () => {
    const table = mount(DataTable, {
        props: { value: [{ name: 'Copper', code: 'Cu' }], reorderableColumns: true },
        global: { components: { Column } },
        slots: { default: '<Column selectionMode="multiple" /><Column field="name" header="Name" /><Column field="code" header="Code" />' }
    });

    try {
        const [selection, name] = table.findAll('thead th');
        const event = { dataTransfer: { setData: vi.fn() } };

        await name.trigger('mousedown');
        await name.trigger('dragstart', event);
        await selection.trigger('dragover', event);
        await selection.trigger('drop', event);

        expect(table.findAll('thead th').map((cell) => cell.text())).toEqual(['Name', '', 'Code']);
        expect(table.findAll('tbody td').map((cell) => cell.text())).toEqual(['Copper', '', 'Cu']);
        expect(table.findAll('tbody input[type="checkbox"]')).toHaveLength(1);
    } finally {
        table.unmount();
    }
});
