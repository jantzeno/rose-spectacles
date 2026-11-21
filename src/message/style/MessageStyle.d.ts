/**
 *
 * Message groups a collection of contents in tabs.
 *
 *
 * @module messagestyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum MessageClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-message',
    /**
     * Class name of the content element
     */
    content = 'rs-message-content',
    /**
     * Class name of the icon element
     */
    icon = 'rs-message-icon',
    /**
     * Class name of the text element
     */
    text = 'rs-message-text',
    /**
     * Class name of the close button element
     */
    closeButton = 'rs-message-close-button',
    /**
     * Class name of the close icon element
     */
    closeIcon = 'rs-message-close-icon'
}

export interface MessageStyle extends BaseStyle {}

declare const style: MessageStyle;
export default style;
