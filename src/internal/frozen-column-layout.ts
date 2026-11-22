import type { CSSProperties } from 'vue';
import { getNextElementSibling, getOuterWidth, getPreviousElementSibling } from './utils/dom/index';

interface TableResize {
    observer: ResizeObserver;
    listeners: Set<() => void>;
}

const tableResizes = new WeakMap<HTMLTableElement, TableResize>();

export function observeFrozenColumn(cell: HTMLElement, update: () => void): (() => void) | null {
    const table = cell.closest('table');
    const Observer = cell.ownerDocument.defaultView?.ResizeObserver;

    if (!table || !Observer) return null;

    let entry = tableResizes.get(table);

    if (!entry) {
        const listeners = new Set<() => void>();
        const observer = new Observer(() => listeners.forEach((listener) => listener()));

        observer.observe(table);
        entry = { observer, listeners };
        tableResizes.set(table, entry);
    }

    const { observer, listeners } = entry;
    const header = table.tHead?.contains(cell) ?? false;

    listeners.add(update);
    if (header) observer.observe(cell);

    return () => {
        listeners.delete(update);
        if (header) observer.unobserve(cell);

        if (listeners.size === 0) {
            observer.disconnect();
            tableResizes.delete(table);
        }
    };
}

export function updateFrozenColumnOffset(cell: HTMLElement, align: unknown, style: CSSProperties) {
    const rightAligned = align === 'right';
    const selector = '[data-p-frozen-column="true"]';
    const row = cell.parentElement;
    let offset = 0;

    if (cell instanceof HTMLTableCellElement && row instanceof HTMLTableRowElement && row.sectionRowIndex > 0 && row.parentElement?.tagName === 'THEAD') {
        const headerCells = getHeaderRowCells(row.parentElement as HTMLTableSectionElement, row.sectionRowIndex);
        const index = headerCells.indexOf(cell);
        const siblings = rightAligned ? headerCells.slice(index + 1) : headerCells.slice(0, index);

        for (const sibling of siblings) {
            if (sibling.matches(selector)) offset += getOuterWidth(sibling);
        }
    } else {
        const adjacent = rightAligned ? getNextElementSibling : getPreviousElementSibling;

        for (let sibling = adjacent(cell, selector); sibling; sibling = adjacent(sibling, selector)) {
            offset += getOuterWidth(sibling);
        }
    }

    style[rightAligned ? 'insetInlineEnd' : 'insetInlineStart'] = `${offset}px`;
}

function getHeaderRowCells(header: HTMLTableSectionElement, rowIndex: number): HTMLTableCellElement[] {
    const grid = Array.from({ length: rowIndex + 1 }, () => [] as (HTMLTableCellElement | undefined)[]);

    for (let row = 0; row <= rowIndex; row++) {
        let column = 0;

        for (const cell of header.rows[row].cells) {
            // Earlier rowspans already occupy slots in this row.
            while (grid[row][column]) column++;

            const endColumn = column + cell.colSpan;
            const endRow = cell.rowSpan === 0 ? grid.length : Math.min(grid.length, row + cell.rowSpan);

            for (let level = row; level < endRow; level++) {
                const slots = grid[level];

                slots.length = Math.max(slots.length, endColumn);
                slots.fill(cell, column, endColumn);
            }

            column = endColumn;
        }
    }

    return [...new Set(grid[rowIndex])].filter((cell) => cell !== undefined);
}
