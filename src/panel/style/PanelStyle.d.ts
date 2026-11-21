/**
 *
 * Panel is a container with the optional content toggle feature.
 *
 * [Live Demo](https://openvue.dev/panel/)
 *
 * @module panelstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum PanelClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-panel',
    /**
     * Class name of the header element
     */
    header = 'rs-panel-header',
    /**
     * Class name of the title element
     */
    title = 'rs-panel-title',
    /**
     * Class name of the header actions element
     */
    headerActions = 'rs-panel-header-actions',
    /**
     * Class name of the toggle button element
     */
    pcToggleButton = 'rs-panel-toggle-button',
    /**
     * Class name of the content container element
     */
    contentContainer = 'rs-panel-content-container',
    /**
     * Class name of the content element
     */
    content = 'rs-panel-content',
    /**
     * Class name of the footer element
     */
    footer = 'rs-panel-footer'
}

export interface PanelStyle extends BaseStyle {}
