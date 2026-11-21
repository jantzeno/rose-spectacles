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
