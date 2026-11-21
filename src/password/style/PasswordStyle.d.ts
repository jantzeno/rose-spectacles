/**
 *
 * Password displays strength indicator for password fields.
 *
 * [Live Demo](https://openvue.dev/password/)
 *
 * @module passwordstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum PasswordClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-password',
    /**
     * Class name of the pt input element
     */
    pcInput = 'rs-password-input',
    /**
     * Class name of the mask icon element
     */
    maskIcon = 'rs-password-mask-icon',
    /**
     * Class name of the unmask icon element
     */
    unmaskIcon = 'rs-password-unmask-icon',
    /**
     * Class name of the clear icon element
     */
    clearIcon = 'rs-password-clear-icon',
    /**
     * Class name of the overlay element
     */
    overlay = 'rs-password-overlay',
    /**
     * Class name of the meter element
     */
    meter = 'rs-password-meter',
    /**
     * Class name of the meter label element
     */
    meterLabel = 'rs-password-meter-label',
    /**
     * Class name of the meter text element
     */
    meterText = 'rs-password-meter-text'
}

export interface PasswordStyle extends BaseStyle {}
