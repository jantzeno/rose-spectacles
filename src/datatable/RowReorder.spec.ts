import { mount } from '@vue/test-utils';
import Column from '../column/Column.vue';
import DataTable from './DataTable.vue';

function mountReorderableTable() {
    return mount(DataTable, {
        props: { value: [{ name: 'Copper' }, { name: 'Brass' }, { name: 'Silver' }, { name: 'Gold' }] },
        global: { components: { Column } },
        slots: { default: '<Column rowReorder /><Column field="name" />' }
    });
}

function dragEvent(element: Element, type: string, clientY = 0, relatedTarget?: EventTarget) {
    const event = new MouseEvent(type, { bubbles: true, cancelable: true, clientY, relatedTarget });

    Object.defineProperty(event, 'pageY', { value: clientY });
    element.dispatchEvent(event);
}

function rowRect(top: number): DOMRect {
    const bounds = { x: 0, y: top, left: 0, right: 150, top, bottom: top + 30, width: 150, height: 30 };

    return { ...bounds, toJSON: () => bounds };
}

const topMarker = 'data-p-datatable-dragpoint-top';
const bottomMarker = 'data-p-datatable-dragpoint-bottom';

it('keeps the same drop marker across adjacent rows and clears it when the drag is canceled', () => {
    const table = mountReorderableTable();
    const [, first, second, source] = table.findAll<HTMLTableRowElement>('tbody tr').map((row) => row.element);
    const firstRect = vi.spyOn(first, 'getBoundingClientRect').mockReturnValue(rowRect(30));
    const secondRect = vi.spyOn(second, 'getBoundingClientRect').mockReturnValue(rowRect(60));
    const height = vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(30);

    try {
        dragEvent(source, 'dragstart');
        dragEvent(first.cells[1], 'dragover', 59);
        expect(first.getAttribute(bottomMarker)).toBe('true');

        dragEvent(first.cells[1], 'dragleave', 59, first.cells[0]);
        expect(first.getAttribute(bottomMarker)).toBe('true');

        dragEvent(first.cells[0], 'dragleave', 60, second.cells[0]);
        expect(first.getAttribute(bottomMarker)).toBe('true');
        dragEvent(second.cells[0], 'dragover', 61);
        expect(first.getAttribute(bottomMarker)).toBe('true');

        dragEvent(source, 'dragend');
        expect(first.getAttribute(bottomMarker)).not.toBe('true');
        expect(first.classList.contains('rs-datatable-dragpoint-bottom')).toBe(false);
        expect(table.emitted('row-reorder')).toBeUndefined();
    } finally {
        table.unmount();
        firstRect.mockRestore();
        secondRect.mockRestore();
        height.mockRestore();
    }
});

it('shows a single boundary and emits the corresponding row order on drop', () => {
    const table = mountReorderableTable();
    const [first, , , source] = table.findAll<HTMLTableRowElement>('tbody tr').map((row) => row.element);
    const rect = vi.spyOn(first, 'getBoundingClientRect').mockReturnValue(rowRect(0));
    const height = vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(30);

    try {
        dragEvent(source, 'dragstart');
        dragEvent(first, 'dragover', 5);
        expect(first.getAttribute(topMarker)).toBe('true');

        dragEvent(first, 'dragover', 25);
        expect(first.getAttribute(topMarker)).not.toBe('true');
        expect(first.getAttribute(bottomMarker)).toBe('true');

        dragEvent(first, 'drop', 25);
        expect(first.getAttribute(bottomMarker)).not.toBe('true');
        expect(table.emitted('row-reorder')).toMatchObject([
            [
                {
                    dragIndex: 3,
                    dropIndex: 1,
                    value: [{ name: 'Copper' }, { name: 'Gold' }, { name: 'Brass' }, { name: 'Silver' }]
                }
            ]
        ]);
    } finally {
        table.unmount();
        rect.mockRestore();
        height.mockRestore();
    }
});
