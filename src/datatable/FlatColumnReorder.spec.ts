import { mount } from '@vue/test-utils';
import { h, nextTick, ref } from 'vue';
import Column from '../column/Column.vue';
import DataTable from './DataTable.vue';

function dragColumn(source: HTMLTableCellElement, target: HTMLTableCellElement, after: boolean) {
    const clientX = after ? 500 : -10;

    source.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    for (const [cell, type] of [
        [source, 'dragstart'],
        [target, 'dragover'],
        [target, 'drop']
    ] as const) {
        const event = new MouseEvent(type, { bubbles: true, cancelable: true, clientX });

        Object.defineProperty(event, 'pageX', { value: clientX });
        cell.dispatchEvent(event);
    }

    return nextTick();
}

it.each([
    { anchor: 'Quantity', after: false },
    { anchor: 'Category', after: true }
])('keeps flat widths with their fields after a drop against $anchor', async ({ anchor, after }) => {
    const codeVisible = ref(false);
    const table = mount(
        {
            render: () =>
                h(
                    DataTable,
                    {
                        value: [{ code: 'Cu', name: 'Copper', category: 'Metal', quantity: 3 }],
                        reorderableColumns: true,
                        filters: { name: { value: null, matchMode: 'contains' } },
                        filterDisplay: 'row'
                    },
                    {
                        default: () => [
                            h(Column, { field: 'code', header: 'Code', hidden: !codeVisible.value }),
                            h(Column, { field: 'name', header: 'Name' }),
                            h(Column, { field: 'category', header: 'Category' }),
                            h(Column, { field: 'quantity', header: 'Quantity' })
                        ]
                    }
                )
        },
        { attachTo: document.body }
    );
    const knownWidths = { Code: 60, Name: 220, Category: 120, Quantity: 100 };
    const width = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (this: HTMLElement) {
        const applied = parseFloat(getComputedStyle(this).width);

        return applied || (knownWidths[this.textContent?.trim() as keyof typeof knownWidths] ?? 0);
    });
    const headings = () => table.findAll<HTMLTableCellElement>('thead tr:first-child th');
    const getHeading = (label: string) => headings().find((heading) => heading.text() === label)!.element;
    const appliedWidths = () => {
        const style = table.getComponent(DataTable).vm.styleElement?.textContent ?? '';

        return [...style.matchAll(/th:nth-child\((\d+)\)[\s\S]*?width:\s*(\d+)px/g)].map(([, position, width]) => [
            headings()[Number(position) - 1]?.text(),
            Number(width)
        ]);
    };

    try {
        expect(table.findAll('thead tr')).toHaveLength(2);
        await dragColumn(getHeading('Name'), getHeading(anchor), after);

        expect(headings().map((heading) => heading.text())).toEqual(['Category', 'Name', 'Quantity']);
        expect(table.findAll('tbody td').map((cell) => cell.text())).toEqual(['Metal', 'Copper', '3']);
        expect(appliedWidths()).toEqual([
            ['Category', 120],
            ['Name', 220],
            ['Quantity', 100]
        ]);

        const quantityDrop = dragColumn(getHeading('Quantity'), getHeading('Category'), false);
        const nameDrop = dragColumn(getHeading('Name'), getHeading('Quantity'), false);
        await Promise.all([quantityDrop, nameDrop]);
        expect(headings().map((heading) => heading.text())).toEqual(['Name', 'Quantity', 'Category']);
        expect(appliedWidths()).toEqual([
            ['Name', 220],
            ['Quantity', 100],
            ['Category', 120]
        ]);

        codeVisible.value = true;
        await nextTick();

        expect(headings().map((heading) => heading.text())).toEqual(['Code', 'Name', 'Quantity', 'Category']);
        expect(appliedWidths()).toEqual([
            ['Name', 220],
            ['Quantity', 100],
            ['Category', 120]
        ]);
    } finally {
        table.unmount();
        width.mockRestore();
    }
});

it('reorders unnamed selection and expansion columns without duplicating either one', async () => {
    const table = mount(DataTable, {
        props: { value: [{ name: 'Copper', code: 'Cu' }], reorderableColumns: true },
        global: { components: { Column } },
        slots: {
            default:
                '<Column selectionMode="multiple" header="Selection" /><Column expander header="Expansion" /><Column field="name" header="Name" /><Column field="code" header="Code" />'
        }
    });
    const headings = () => table.findAll<HTMLTableCellElement>('thead th');
    const getHeading = (label: string) => headings().find((heading) => heading.text() === label)!.element;

    try {
        await dragColumn(getHeading('Name'), getHeading('Expansion'), false);
        expect(headings().map((heading) => heading.text())).toEqual(['Selection', 'Name', 'Expansion', 'Code']);

        await dragColumn(getHeading('Expansion'), getHeading('Selection'), false);
        expect(headings().map((heading) => heading.text())).toEqual(['Expansion', 'Selection', 'Name', 'Code']);
        expect(table.findAll('tbody td').map((cell) => cell.text())).toEqual(['', '', 'Copper', 'Cu']);
        expect(table.findAll('tbody input[type="checkbox"]')).toHaveLength(1);
        expect(table.findAll('tbody button')).toHaveLength(1);
    } finally {
        table.unmount();
    }
});

it('restores an older column order containing unnamed controls without duplicates', async () => {
    const stateKey = 'legacy-flat-control-order';
    window.sessionStorage.setItem(stateKey, JSON.stringify({ columnOrder: ['name', null, null, 'code', null] }));

    const table = mount(DataTable, {
        props: { value: [{ name: 'Copper', code: 'Cu' }], reorderableColumns: true, stateKey, stateStorage: 'session' },
        global: { components: { Column } },
        slots: {
            default:
                '<Column selectionMode="multiple" header="Selection" /><Column expander header="Expansion" /><Column field="name" header="Name" /><Column field="code" header="Code" />'
        }
    });

    try {
        await nextTick();

        expect(table.findAll('thead th').map((heading) => heading.text())).toEqual(['Name', 'Selection', 'Expansion', 'Code']);
        expect(table.findAll('tbody td').map((cell) => cell.text())).toEqual(['Copper', '', '', 'Cu']);
        expect(table.findAll('tbody input[type="checkbox"]')).toHaveLength(1);
        expect(table.findAll('tbody button')).toHaveLength(1);
    } finally {
        table.unmount();
        window.sessionStorage.removeItem(stateKey);
    }
});
