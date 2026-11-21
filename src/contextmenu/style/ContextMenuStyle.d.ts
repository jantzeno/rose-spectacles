/**
 *
 * ContextMenu displays an overlay menu on right click of its target. Note that components like DataTable has special integration with ContextMenu.
 * Refer to documentation of the individual documentation of the with context menu support.
 *
 * [Live Demo](https://openvue.dev/contextmenu/)
 *
 * @module contextmenustyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum ContextMenuClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-contextmenu',
    /**
     * Class name of the root list element
     */
    rootList = 'rs-contextmenu-root-list',
    /**
     * Class name of the item element
     */
    item = 'rs-contextmenu-item',
    /**
     * Class name of the item content element
     */
    itemContent = 'rs-contextmenu-item-content',
    /**
     * Class name of the item link element
     */
    itemLink = 'rs-contextmenu-item-link',
    /**
     * Class name of the item icon element
     */
    itemIcon = 'rs-contextmenu-item-icon',
    /**
     * Class name of the item label element
     */
    itemLabel = 'rs-contextmenu-item-label',
    /**
     * Class name of the submenu icon element
     */
    submenuIcon = 'rs-contextmenu-submenu-icon',
    /**
     * Class name of the submenu element
     */
    submenu = 'rs-contextmenu-submenu',
    /**
     * Class name of the separator element
     */
    separator = 'rs-contextmenu-separator'
}

export interface ContextMenuStyle extends BaseStyle {}
