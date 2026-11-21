/**
 *
 * ScrollPanel is a cross browser, lightweight and themable alternative to native browser scrollbar.
 *
 * [Live Demo](https://openvue.dev/scrollpanel/)
 *
 * @module scrollpanelstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum ScrollPanelClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-scrollpanel',
    /**
     * Class name of the content container element
     */
    contentContainer = 'rs-scrollpanel-content-container',
    /**
     * Class name of the content element
     */
    content = 'rs-scrollpanel-content',
    /**
     * Class name of the bar x element
     */
    barX = 'rs-scrollpanel-bar-x',
    /**
     * Class name of the bar y element
     */
    barY = 'rs-scrollpanel-bar-y'
}

export interface ScrollPanelStyle extends BaseStyle {}
