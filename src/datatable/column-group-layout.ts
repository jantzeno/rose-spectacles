import type { VNode } from 'vue';
import { getVNodeProp } from '../core/utils/Utils';

export interface ColumnRange {
    start: number;
    end: number;
}

export interface GroupedColumn extends ColumnRange {
    column: VNode;
}

export function getColumnGroupLayout(rows: VNode[][]): GroupedColumn[][] {
    const occupiedUntil: number[] = [];

    return rows.map((columns, row) => {
        let start = 0;

        return columns.map((column) => {
            while (occupiedUntil[start] > row) start++;

            const end = start + Math.min(1000, Math.max(1, parseInt(getVNodeProp(column, 'colspan'), 10)) || 1);
            const rowspan = parseInt(getVNodeProp(column, 'rowspan'), 10);
            const nextFreeRow = rowspan === 0 ? rows.length : row + (Math.max(1, rowspan) || 1);
            const cell = { column, start, end };

            // Columns covered by a rowspan are absent from the later row's slot.
            for (; start < end; start++) occupiedUntil[start] = nextFreeRow;

            return cell;
        });
    });
}

export function projectColumnGroupLayout(layout: GroupedColumn[][], order: number[] | null): GroupedColumn[][] | null {
    if (!order) return layout;

    const positions: number[] = [];
    const projected: GroupedColumn[][] = [];

    order.forEach((column, index) => (positions[column] = index));

    for (const row of layout) {
        const cells: GroupedColumn[] = [];

        for (const cell of row) {
            const columns = positions.slice(cell.start, cell.end);
            const start = Math.min(...columns);
            const end = Math.max(...columns) + 1;

            if (columns.length !== cell.end - cell.start || end - start !== columns.length) return null;

            cells.push({ column: cell.column, start, end });
        }

        projected.push(cells.sort((left, right) => left.start - right.start));
    }

    return projected;
}

export function getColumnGroupMove(ranges: ColumnRange[], from: ColumnRange, target: ColumnRange, count: number, after: boolean) {
    if (from.start < target.end && target.start < from.end) return null;

    const covers = (outer: ColumnRange, inner: ColumnRange) => outer.start <= inner.start && outer.end >= inner.end;
    const size = (range: ColumnRange) => range.end - range.start;
    const siblings = [...ranges].sort((left, right) => size(right) - size(left));
    const parent = siblings.filter((range) => covers(range, from) && covers(range, target)).at(-1) ?? { start: 0, end: count };
    const block = (cell: ColumnRange) => siblings.find((range) => size(range) < size(parent) && covers(parent, range) && covers(range, cell)) ?? cell;
    const source = block(from);
    const destination = block(target);
    const edge = after ? destination.end : destination.start;

    if (edge >= source.start && edge <= source.end) return null;

    const order = Array.from({ length: count }, (_, index) => index);
    const moved = order.splice(source.start, size(source));
    const insertAt = edge > source.end ? edge - moved.length : edge;

    order.splice(insertAt, 0, ...moved);

    return { order, source, destination, insertAt };
}
