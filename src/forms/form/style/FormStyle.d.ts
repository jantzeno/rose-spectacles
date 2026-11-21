/**
 *
 *
 * @module formstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum FormClasses {
    /**
     * The class of root element
     */
    root = 'rs-form'
}

export interface FormStyle extends BaseStyle {}

declare const style: FormStyle;
export default style;
