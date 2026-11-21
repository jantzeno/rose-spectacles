/**
 *
 * RadioButton is an extension to standard radio button element with theming.
 *
 *
 * @module radiobuttonstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum RadioButtonClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-radiobutton',
    /**
     * Class name of the box element
     */
    box = 'rs-radiobutton-box',
    /**
     * Class name of the input element
     */
    input = 'rs-radiobutton-input',
    /**
     * Class name of the icon element
     */
    icon = 'rs-radiobutton-icon'
}

export interface RadioButtonStyle extends BaseStyle {}

declare const style: RadioButtonStyle;
export default style;
