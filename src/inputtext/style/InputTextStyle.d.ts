/**
 *
 * InputText renders a text field to enter data.
 *
 * [Live Demo](https://openvue.dev/inputtext/)
 *
 * @module inputtextstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum InputTextClasses {
    /**
     * The class of root element
     */
    root = 'rs-inputtext'
}

export interface InputTextStyle extends BaseStyle {}

declare const style: InputTextStyle;
export default style;
