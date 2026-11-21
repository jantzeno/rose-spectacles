/**
 *
 * Drawer is a panel component displayed as an overlay at the edges of the screen.
 *
 *
 * @module drawerstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum DrawerClasses {
    /**
     * Class name of the mask element
     */
    mask = 'rs-drawer-mask',
    /**
     * Class name of the root element
     */
    root = 'rs-drawer',
    /**
     * Class name of the header element
     */
    header = 'rs-drawer-header',
    /**
     * Class name of the title element
     */
    title = 'rs-drawer-title',
    /**
     * Class name of the close button element
     */
    pcCloseButton = 'rs-drawer-close-button',
    /**
     * Class name of the content element
     */
    content = 'rs-drawer-content'
}

export interface DrawerStyle extends BaseStyle {}

declare const style: DrawerStyle;
export default style;
