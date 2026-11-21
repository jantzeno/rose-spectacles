/**
 *
 * ToggleSwitch is used to select a boolean value.
 *
 * [Live Demo](https://openvue.dev/toggleswitch/)
 *
 * @module toggleswitchstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum ToggleSwitchClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-toggleswitch',
    /**
     * Class name of the input element
     */
    input = 'rs-toggleswitch-input',
    /**
     * Class name of the slider element
     */
    slider = 'rs-toggleswitch-slider',
    /**
     * Class name of the handle element
     */
    handle = 'rs-toggleswitch-handle'
}

export interface ToggleSwitchStyle extends BaseStyle {}

declare const style: ToggleSwitchStyle;
export default style;
