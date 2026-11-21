import type { MenuItem } from 'rose-spectacles/menuitem';

export interface ProcessedMenuItem {
    item: MenuItem;
    key: string;
    items?: ProcessedMenuItem[];
}
