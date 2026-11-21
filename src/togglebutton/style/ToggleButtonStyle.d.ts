/**
 *
 * ToggleButton is used to select a boolean value using a button.
 *
 * [Live Demo](https://openvue.dev/togglebutton/)
 *
 * @module togglebuttonstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum ToggleButtonClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-togglebutton',
    /**
     * Class name of the icon element
     */
    icon = 'rs-togglebutton-icon',
    /**
     * Class name of the label element
     */
    label = 'rs-togglebutton-label'
}

export interface ToggleButtonStyle extends BaseStyle {}
