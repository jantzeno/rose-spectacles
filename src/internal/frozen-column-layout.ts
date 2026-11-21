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
    const adjacent = rightAligned ? getNextElementSibling : getPreviousElementSibling;
    const selector = '[data-p-frozen-column="true"]';
    let offset = 0;

    for (let sibling = adjacent(cell, selector); sibling; sibling = adjacent(sibling, selector)) {
        offset += getOuterWidth(sibling);
    }

    style[rightAligned ? 'insetInlineEnd' : 'insetInlineStart'] = `${offset}px`;
}
