/**
 *
 * Menubar is a horizontal menu component.
 *
 *
 * @module menubarstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum MenubarClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-menubar',
    /**
     * Class name of the start element
     */
    start = 'rs-menubar-start',
    /**
     * Class name of the button element
     */
    button = 'rs-menubar-button',
    /**
     * Class name of the root list element
     */
    rootList = 'rs-menubar-root-list',
    /**
     * Class name of the item element
     */
    item = 'rs-menubar-item',
    /**
     * Class name of the item content element
     */
    itemContent = 'rs-menubar-item-content',
    /**
     * Class name of the item link element
     */
    itemLink = 'rs-menubar-item-link',
    /**
     * Class name of the item icon element
     */
    itemIcon = 'rs-menubar-item-icon',
    /**
     * Class name of the item label element
     */
    itemLabel = 'rs-menubar-item-label',
    /**
     * Class name of the submenu icon element
     */
    submenuIcon = 'rs-menubar-submenu-icon',
    /**
     * Class name of the submenu element
     */
    submenu = 'rs-menubar-submenu',
    /**
     * Class name of the separator element
     */
    separator = 'rs-menubar-separator',
    /**
     * Class name of the end element
     */
    end = 'rs-menubar-end'
}

export interface MenubarStyle extends BaseStyle {}

declare const style: MenubarStyle;
export default style;
