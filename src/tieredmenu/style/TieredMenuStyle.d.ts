/**
 *
 * TieredMenu displays submenus in nested overlays.
 *
 * [Live Demo](https://openvue.dev/menu/)
 *
 * @module tieredmenustyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum TieredMenuClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-tieredmenu',
    /**
     * Class name of the start element
     */
    start = 'rs-tieredmenu-start',
    /**
     * Class name of the root list element
     */
    rootList = 'rs-tieredmenu-root-list',
    /**
     * Class name of the item element
     */
    item = 'rs-tieredmenu-item',
    /**
     * Class name of the item content element
     */
    itemContent = 'rs-tieredmenu-item-content',
    /**
     * Class name of the item link element
     */
    itemLink = 'rs-tieredmenu-item-link',
    /**
     * Class name of the item icon element
     */
    itemIcon = 'rs-tieredmenu-item-icon',
    /**
     * Class name of the item label element
     */
    itemLabel = 'rs-tieredmenu-item-label',
    /**
     * Class name of the submenu icon element
     */
    submenuIcon = 'rs-tieredmenu-submenu-icon',
    /**
     * Class name of the submenu element
     */
    submenu = 'rs-tieredmenu-submenu',
    /**
     * Class name of the separator element
     */
    separator = 'rs-tieredmenu-separator',
    /**
     * Class name of the end element
     */
    end = 'rs-tieredmenu-end'
}

export interface TieredMenuStyle extends BaseStyle {}

declare const style: TieredMenuStyle;
export default style;
