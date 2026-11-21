/**
 *
 * Dialog is a container to display content in an overlay window.
 *
 * [Live Demo](https://openvue.dev/dialog)
 *
 * @module dialogstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum DialogClasses {
    /**
     * Class name of the mask element
     */
    mask = 'rs-dialog-mask',
    /**
     * Class name of the root element
     */
    root = 'rs-dialog',
    /**
     * Class name of the header element
     */
    header = 'rs-dialog-header',
    /**
     * Class name of the title element
     */
    title = 'rs-dialog-title',
    /**
     * Class name of the header actions element
     */
    headerActions = 'rs-dialog-header-actions',
    /**
     * Class name of the maximize button element
     */
    pcMaximizeButton = 'rs-dialog-maximize-button',
    /**
     * Class name of the close button element
     */
    pcCloseButton = 'rs-dialog-close-button',
    /**
     * Class name of the content element
     */
    content = 'rs-dialog-content',
    /**
     * Class name of the footer element
     */
    footer = 'rs-dialog-footer'
}

export interface DialogStyle extends BaseStyle {}
