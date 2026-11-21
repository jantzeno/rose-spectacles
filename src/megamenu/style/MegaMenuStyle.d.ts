/**
 *
 * MegaMenu is navigation component that displays submenus together.
 *
 * [Live Demo](https://openvue.dev/megamenu/)
 *
 * @module megamenustyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum MegaMenuClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-megamenu',
    /**
     * Class name of the start element
     */
    start = 'rs-megamenu-start',
    /**
     * Class name of the button element
     */
    button = 'rs-megamenu-button',
    /**
     * Class name of the root list element
     */
    rootList = 'rs-megamenu-root-list',
    /**
     * Class name of the submenu item element
     */
    submenuItem = 'rs-megamenu-submenu-item',
    /**
     * Class name of the item element
     */
    item = 'rs-megamenu-item',
    /**
     * Class name of the item content element
     */
    itemContent = 'rs-megamenu-item-content',
    /**
     * Class name of the item link element
     */
    itemLink = 'rs-megamenu-item-link',
    /**
     * Class name of the item icon element
     */
    itemIcon = 'rs-megamenu-item-icon',
    /**
     * Class name of the item label element
     */
    itemLabel = 'rs-megamenu-item-label',
    /**
     * Class name of the submenu icon element
     */
    submenuIcon = 'rs-megamenu-submenu-icon',
    /**
     * Class name of the panel element
     */
    panel = 'rs-megamenu-panel',
    /**
     * Class name of the grid element
     */
    grid = 'rs-megamenu-grid',
    /**
     * Class name of the submenu element
     */
    submenu = 'rs-megamenu-submenu',
    /**
     * Class name of the submenu item label element
     */
    submenuItemLabel = 'rs-megamenu-submenu-item-label',
    /**
     * Class name of the separator element
     */
    separator = 'rs-megamenu-separator',
    /**
     * Class name of the end element
     */
    end = 'rs-megamenu-end'
}

export interface MegaMenuStyle extends BaseStyle {}
