/**
 *
 * TabMenu is a navigation component that displays items as tab headers. Example below uses nested routes with TabMenu.
 *
 *
 * @module tabmenustyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum TabMenuClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-tabmenu',
    /**
     * Class name of the tablist element
     */
    tablist = 'rs-tabmenu-tablist',
    /**
     * Class name of the item element
     */
    item = 'rs-tabmenu-item',
    /**
     * Class name of the item link element
     */
    itemLink = 'rs-tabmenu-item-link',
    /**
     * Class name of the item icon element
     */
    itemIcon = 'rs-tabmenu-item-icon',
    /**
     * Class name of the item label element
     */
    itemLabel = 'rs-tabmenu-item-label',
    /**
     * Class name of the inkbar element
     */
    inkbar = 'rs-tabmenu-ink-bar'
}

export interface TabMenuStyle extends BaseStyle {}

declare const style: TabMenuStyle;
export default style;
