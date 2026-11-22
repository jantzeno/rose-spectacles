import { resolveFieldData } from '../internal/utils/object/index';

export type RowGroupFields = string | ((row: Record<string, unknown>) => unknown) | readonly string[];

export function isRowGroupField(fields: unknown, field: unknown): boolean {
    return field != null && (Array.isArray(fields) ? fields.includes(field) : fields === field);
}

export function rowGroupKey(row: unknown, fields: unknown): unknown {
    if (!Array.isArray(fields)) return resolveFieldData(row, fields);

    return fields.length > 1 ? fields.map((field) => resolveFieldData(row, field)) : resolveFieldData(row, fields[0]);
}

export function sameRowGroup(fields: unknown, first: unknown, second: unknown): boolean {
    if (Array.isArray(fields) && fields.length > 1) {
        return Array.isArray(first) && Array.isArray(second) && first.length === second.length && first.every((value, index) => value === second[index]);
    }

    return first === second;
}
