import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Column from '../column/Column.vue';
import PrimeVue from '../config/Config';
import DataTable from './DataTable.vue';

const rows = [
    { representative: 'Amy', name: 'Copper' },
    { representative: 'Amy', name: 'Brass' },
    { representative: 'John', name: 'Silver' }
];

it('applies a lowercase rowspan from the Column body cell pass-through callback', () => {
    const table = mount(DataTable, {
        props: { value: rows },
        global: { plugins: [PrimeVue], components: { Column } },
        slots: {
            default: `
                <Column field="representative" :pt="{ bodyCell: () => ({ rowspan: '2' }) }" />
                <Column field="name" />
            `
        }
    });

    try {
        expect(table.get('tbody tr:first-child td').attributes('rowspan')).toBe('2');
    } finally {
        table.unmount();
    }
});

it('keeps a frozen cell offset when its neighboring frozen column continues an earlier rowspan', async () => {
    const width = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(120);
    const table = mount(DataTable, {
        props: { value: rows, rowGroupMode: 'rowspan', groupRowsBy: 'representative', scrollable: true },
        global: { plugins: [PrimeVue], components: { Column } },
        slots: {
            default: `
                <Column field="representative" header="Representative" frozen />
                <Column field="name" header="Name" bodyClass="person" frozen />
            `
        }
    });

    try {
        await nextTick();
        expect(table.get('tbody td[rowspan="2"]').text()).toBe('Amy');
        expect(table.findAll<HTMLTableCellElement>('tbody td.person').map((cell) => cell.element.style.insetInlineStart)).toEqual(['120px', '120px', '120px']);
    } finally {
        table.unmount();
        width.mockRestore();
    }
});
