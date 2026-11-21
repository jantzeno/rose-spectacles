/**
 *
 * ConfirmPopup displays a confirmation overlay displayed relatively to its target.
 *
 *
 * @module confirmpopupstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum ConfirmPopupClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-confirmpopup',
    /**
     * Class name of the content element
     */
    content = 'rs-confirmpopup-content',
    /**
     * Class name of the icon element
     */
    icon = 'rs-confirmpopup-icon',
    /**
     * Class name of the message element
     */
    message = 'rs-confirmpopup-message',
    /**
     * Class name of the footer element
     */
    footer = 'rs-confirmpopup-footer',
    /**
     * Class name of the reject button element
     */
    pcRejectButton = 'rs-confirmpopup-reject-button',
    /**
     * Class name of the accept button element
     */
    pcAcceptButton = 'rs-confirmpopup-accept-button'
}

export interface ConfirmPopupStyle extends BaseStyle {}

declare const style: ConfirmPopupStyle;
export default style;
