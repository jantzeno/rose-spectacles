import { mount } from '@vue/test-utils';
import type { ColumnPassThroughMethodOptions } from 'rose-spectacles/column';
import Column from '../column/Column.vue';
import DataTable from './DataTable.vue';

it('passes the camelCase column props to a DataTable cell callback', () => {
    const cell = ({ props }: ColumnPassThroughMethodOptions) => ({
        'data-sort-field': props.sortField,
        'data-legacy-sort-field': (props as Record<string, unknown>)['sort-field']
    });
    const wrapper = mount({
        components: { DataTable, Column },
        setup: () => ({ records: [{ name: 'Oslo', code: 'OSL' }], cell }),
        template: `
            <DataTable :value="records">
                <Column field="name" sort-field="code" :pt="{ bodycell: cell }" />
            </DataTable>
        `
    });

    try {
        const cell = wrapper.get('tbody td');
        expect(cell.attributes('data-sort-field')).toBe('code');
        expect(cell.attributes('data-legacy-sort-field')).toBe('code');
    } finally {
        wrapper.unmount();
    }
});
