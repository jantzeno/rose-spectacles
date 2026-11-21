/**
 *
 * [Live Demo](https://openvue.dev/forms/)
 *
 * @module formfieldstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum FormFieldClasses {
    /**
     * The class of root element
     */
    root = 'rs-formfield'
}

export interface FormFieldStyle extends BaseStyle {}

declare const style: FormFieldStyle;
export default style;
