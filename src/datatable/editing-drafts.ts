import { toRaw } from 'vue';
import { resolveFieldData } from '../internal/utils/object/index';
import type { TableField, TableRow } from './BaseDataTable.vue';

export type EditingRowKey = string | number | symbol;

interface EditingDraft {
    source: TableRow;
    data: TableRow;
    cells: Set<symbol>;
}

export type EditingDrafts = Map<EditingRowKey, EditingDraft>;

export interface EditingDraftChange {
    key: EditingRowKey;
    data: TableRow;
    cell: symbol;
    editing: boolean;
}

const keysByRow = new WeakMap<object, symbol>();

export function getEditingRowKey(row: unknown, dataKey?: TableField | null): EditingRowKey | undefined {
    const key: unknown = dataKey ? resolveFieldData(row, dataKey) : undefined;

    if (typeof key === 'string' || typeof key === 'number' || typeof key === 'symbol') return key;
    if (typeof row !== 'object' || row === null) return undefined;

    const original = toRaw(row);
    let identity = keysByRow.get(original);

    if (!identity) {
        identity = Symbol();
        keysByRow.set(original, identity);
    }

    return identity;
}
