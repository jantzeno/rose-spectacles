import type { VNode } from 'vue';
import { getVNodeProp } from '../core/utils/Utils';
import type { TableField } from './BaseDataTable.vue';
import type { DataTableFilterMeta } from './DataTable';

export function getColumnFilterField(column: VNode | null | undefined): TableField | null {
    return getVNodeProp(column, 'filterField') || getVNodeProp(column, 'field') || null;
}

export function getColumnFilterKey(column: VNode | null | undefined, filters: DataTableFilterMeta | null | undefined): string | undefined {
    const field = getColumnFilterField(column);
    if (typeof field !== 'function') return field ?? undefined;

    const key = getVNodeProp(column, 'columnKey');
    return typeof key === 'string' && filters && Object.hasOwn(filters, key) ? key : String(field);
}
