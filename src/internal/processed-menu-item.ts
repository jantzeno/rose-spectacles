import type { MenuItem } from 'rose-spectacles/menuitem';

export interface ProcessedMenuItem {
    item: MenuItem;
    key: string;
    items?: ProcessedMenuItem[];
}

export interface MenuNavigationItem extends ProcessedMenuItem {
    index: number;
    level: number;
    parentKey: string;
    parent?: MenuNavigationItem;
    items: MenuNavigationItem[];
}

export interface MenuItemEvent<E extends Event = MouseEvent | KeyboardEvent> {
    originalEvent: E;
    processedItem: MenuNavigationItem;
    isFocus?: boolean;
}

export interface MegaMenuNode {
    item: MenuItem;
    key: string;
    index: number;
    level: number;
    parentKey: string;
    parent?: MegaMenuNode;
    columnIndex: number;
    items: MegaMenuNode[] | MegaMenuNode[][];
}

export function getMegaMenuColumns(items: MegaMenuNode['items']): MegaMenuNode[][] {
    return Array.isArray(items[0]) ? (items as MegaMenuNode[][]) : [];
}

export function getMegaMenuItems(items: MegaMenuNode['items']): MegaMenuNode[] {
    return Array.isArray(items[0]) ? [] : (items as MegaMenuNode[]);
}
