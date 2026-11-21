/**
 *
 * PanelMenu is a hybrid of Accordion and Tree components.
 *
 *
 * @module panelmenustyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum PanelMenuClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-panelmenu',
    /**
     * Class name of the panel element
     */
    panel = 'rs-panelmenu-panel',
    /**
     * Class name of the header element
     */
    header = 'rs-panelmenu-header',
    /**
     * Class name of the header content element
     */
    headerContent = 'rs-panelmenu-header-content',
    /**
     * Class name of the header link element
     */
    headerLink = 'rs-panelmenu-header-link',
    /**
     * Class name of the header icon element
     */
    headerIcon = 'rs-panelmenu-header-icon',
    /**
     * Class name of the header label element
     */
    headerLabel = 'rs-panelmenu-header-label',
    /**
     * Class name of the content container element
     */
    contentContainer = 'rs-panelmenu-content-container',
    /**
     * Class name of the content element
     */
    content = 'rs-panelmenu-content',
    /**
     * Class name of the root list element
     */
    rootList = 'rs-panelmenu-root-list',
    /**
     * Class name of the item element
     */
    item = 'rs-panelmenu-item',
    /**
     * Class name of the item content element
     */
    itemContent = 'rs-panelmenu-item-content',
    /**
     * Class name of the item link element
     */
    itemLink = 'rs-panelmenu-item-link',
    /**
     * Class name of the item icon element
     */
    itemIcon = 'rs-panelmenu-item-icon',
    /**
     * Class name of the item label element
     */
    itemLabel = 'rs-panelmenu-item-label',
    /**
     * Class name of the submenu icon element
     */
    submenuIcon = 'rs-panelmenu-submenu-icon',
    /**
     * Class name of the submenu element
     */
    submenu = 'rs-panelmenu-submenu',
    separator = 'rs-menuitem-separator'
}

export interface PanelMenuStyle extends BaseStyle {}

declare const style: PanelMenuStyle;
export default style;
