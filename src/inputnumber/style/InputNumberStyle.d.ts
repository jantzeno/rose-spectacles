/**
 *
 * InputNumber is an input component to provide numerical input.
 *
 * [Live Demo](https://openvue.dev/inputnumber/)
 *
 * @module inputnumberstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum InputNumberClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-inputnumber',
    /**
     * Class name of the input element
     */
    pcInput = 'rs-inputnumber-input',
    /**
     * Class name of the button group element
     */
    buttonGroup = 'rs-inputnumber-button-group',
    /**
     * Class name of the increment button element
     */
    incrementButton = 'rs-inputnumber-increment-button',
    /**
     * Class name of the decrement button element
     */
    decrementButton = 'rs-inputnumber-decrement-button'
}

export interface InputNumberStyle extends BaseStyle {}

declare const style: InputNumberStyle;
export default style;
