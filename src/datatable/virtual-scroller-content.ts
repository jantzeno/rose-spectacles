import type { ComponentPublicInstance, StyleValue, VNode } from 'vue';

export interface CellLoaderOptions {
    cellIndex: number;
    cellFirst: boolean;
    cellLast: boolean;
    cellEven: boolean;
    cellOdd: boolean;
    column: VNode;
    field: unknown;
}

export interface VirtualScrollerContent {
    contentRef?: (element: Element | ComponentPublicInstance | null) => void;
    contentStyle?: StyleValue;
    getItemOptions?: (index: number) => { index: number };
    getLoaderOptions?: (index: number, cell: CellLoaderOptions) => unknown;
    columns?: VNode[];
    loading?: boolean;
}
