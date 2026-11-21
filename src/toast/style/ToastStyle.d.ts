/**
 *
 * Toast is used to display messages in an overlay.
 *
 * [Live Demo](https://openvue.dev/toast/)
 *
 * @module toaststyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum ToastClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-toast',
    /**
     * Class name of the message element
     */
    message = 'rs-toast-message',
    /**
     * Class name of the message content element
     */
    messageContent = 'rs-toast-message-content',
    /**
     * Class name of the message icon element
     */
    messageIcon = 'rs-toast-message-icon',
    /**
     * Class name of the message text element
     */
    messageText = 'rs-toast-message-text',
    /**
     * Class name of the summary element
     */
    summary = 'rs-toast-summary',
    /**
     * Class name of the detail element
     */
    detail = 'rs-toast-detail',
    /**
     * Class name of the close button element
     */
    closeButton = 'rs-toast-close-button',
    /**
     * Class name of the close icon element
     */
    closeIcon = 'rs-toast-close-icon'
}

export interface ToastStyle extends BaseStyle {}

declare const style: ToastStyle;
export default style;
