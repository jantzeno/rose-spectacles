/**
 *
 * InlineMessage component is useful in cases where a single message needs to be displayed related to an element such as forms. It has one property, severity of the message.
 *
 * [Live Demo](https://openvue.dev/inlinemessage/)
 *
 * @module inlinemessagestyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum InlineMessageClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-inlinemessage',
    /**
     * Class name of the icon element
     */
    icon = 'rs-inlinemessage-icon',
    /**
     * Class name of the text element
     */
    text = 'rs-inlinemessage-text'
}

export interface InlineMessageStyle extends BaseStyle {}
