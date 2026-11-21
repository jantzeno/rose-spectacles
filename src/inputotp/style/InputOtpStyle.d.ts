/**
 *
 * InputOtp is used to enter one time passwords.
 *
 *
 * @module inputotpstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum InputOtpClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-inputotp',
    /**
     * Class name of the input element
     */
    pcInput = 'rs-inputotp-input'
}

export interface InputOtpStyle extends BaseStyle {}

declare const style: InputOtpStyle;
export default style;
