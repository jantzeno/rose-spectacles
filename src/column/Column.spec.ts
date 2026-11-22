import { readFileSync } from 'node:fs';
import { mount } from '@vue/test-utils';
import DataTable from '../datatable/DataTable.vue';
import Column from './Column.vue';

it('documents the reorderable column default used by DataTable', async () => {
    const table = mount(DataTable, {
        props: { value: [{ code: 'Cu', name: 'Copper' }], reorderableColumns: true },
        global: { components: { Column } },
        slots: { default: '<Column field="code" /><Column field="name" :reorderableColumn="false" />' }
    });

    try {
        const [enabled, disabled] = table.findAll<HTMLTableCellElement>('thead th');
        await enabled.trigger('mousedown');
        await disabled.trigger('mousedown');

        expect(enabled.element.draggable).toBe(true);
        expect(disabled.element.draggable).toBe(false);
        const declaration = readFileSync(new URL('./Column.d.ts', import.meta.url), 'utf8');

        expect(declaration).toMatch(/@defaultValue true\s+\*\/\s+reorderableColumn\?/);
    } finally {
        table.unmount();
    }
});
