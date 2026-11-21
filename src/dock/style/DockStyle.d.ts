/**
 *
 * Dock is a navigation component consisting of menuitems.
 *
 *
 * @module dockstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum DockClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-dock',
    /**
     * Class name of the list container element
     */
    listContainer = 'rs-dock-list-container',
    /**
     * Class name of the list element
     */
    list = 'rs-dock-list',
    /**
     * Class name of the item element
     */
    item = 'rs-dock-item',
    /**
     * Class name of the item content element
     */
    itemContent = 'rs-dock-item-content',
    /**
     * Class name of the item link element
     */
    itemLink = 'rs-dock-item-link',
    /**
     * Class name of the item icon element
     */
    itemIcon = 'rs-dock-item-icon'
}

export interface DockStyle extends BaseStyle {}

declare const style: DockStyle;
export default style;
