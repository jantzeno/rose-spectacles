/**
 *
 * Button is an extension to standard button element with icons and theming.
 *
 * [Live Demo](https://openvue.dev/button/)
 *
 * @module buttonstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum ButtonClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-button',
    /**
     * Class name of the loading icon element
     */
    loadingIcon = 'rs-button-loading-icon',
    /**
     * Class name of the icon element
     */
    icon = 'rs-button-icon',
    /**
     * Class name of the label element
     */
    label = 'rs-button-label'
}

export interface ButtonStyle extends BaseStyle {}
