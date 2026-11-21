/**
 *
 * ConfirmDialog uses a Dialog UI with confirmDialog method or <ConfirmDialog> tag.
 *
 *
 * @module confirmdialogstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum ConfirmDialogClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-confirmdialog',
    /**
     * Class name of the icon element
     */
    icon = 'rs-confirmdialog-icon',
    /**
     * Class name of the message element
     */
    message = 'rs-confirmdialog-message',
    /**
     * Class name of the reject button element
     */
    pcRejectButton = 'rs-confirmdialog-reject-button',
    /**
     * Class name of the accept button element
     */
    pcAcceptButton = 'rs-confirmdialog-accept-button'
}

export interface ConfirmDialogStyle extends BaseStyle {}

declare const style: ConfirmDialogStyle;
export default style;
