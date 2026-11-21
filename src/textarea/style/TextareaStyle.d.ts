/**
 *
 * Textarea is a multi-line text input element.
 *
 *
 * @module textareastyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum TextareaClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-textarea'
}

export interface TextareaStyle extends BaseStyle {}

declare const style: TextareaStyle;
export default style;
