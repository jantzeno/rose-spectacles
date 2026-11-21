/**
 *
 * Menu is a navigation / command component that supports dynamic and static positioning.
 *
 * [Live Demo](https://openvue.dev/menu/)
 *
 * @module menustyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum MenuClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-menu',
    /**
     * Class name of the start element
     */
    start = 'rs-menu-start',
    /**
     * Class name of the list element
     */
    list = 'rs-menu-list',
    /**
     * Class name of the submenu item element
     */
    submenuItem = 'rs-menu-submenu-item',
    /**
     * Class name of the separator element
     */
    separator = 'rs-menu-separator',
    /**
     * Class name of the end element
     */
    end = 'rs-menu-end',
    /**
     * Class name of the item element
     */
    item = 'rs-menu-item',
    /**
     * Class name of the item content element
     */
    itemContent = 'rs-menu-item-content',
    /**
     * Class name of the item link element
     */
    itemLink = 'rs-menu-item-link',
    /**
     * Class name of the item icon element
     */
    itemIcon = 'rs-menu-item-icon',
    /**
     * Class name of the item label element
     */
    itemLabel = 'rs-menu-item-label'
}

export interface MenuStyle extends BaseStyle {}
