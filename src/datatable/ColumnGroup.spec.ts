import { mount } from '@vue/test-utils';
import { h } from 'vue';
import Column from '../column/Column.vue';
import ColumnGroup from '../columngroup/ColumnGroup.vue';
import Row from '../row/Row.vue';
import DataTable from './DataTable.vue';

it('renders a grouped header whose render-function slot returns one row', () => {
    const table = mount({
        render: () => h(DataTable, { value: [{ city: 'Oslo' }] }, {
            default: () => [
                h(ColumnGroup, { type: 'header' }, { default: () => h(Row, {}, { default: () => h(Column, { header: 'City' }) }) }),
                h(Column, { field: 'city' })
            ]
        })
    });

    try {
        expect(table.get('thead').text()).toBe('City');
        expect(table.get('tbody').text()).toBe('Oslo');
    } finally {
        table.unmount();
    }
});
