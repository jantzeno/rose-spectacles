/**
 *
 * ProgressSpinner is a process status indicator.
 *
 * [Live Demo](https://openvue.dev/progressspinner)
 *
 * @module progressspinnerstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum ProgressSpinnerClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-progressspinner',
    /**
     * Class name of the spin element
     */
    spin = 'rs-progressspinner-spin',
    /**
     * Class name of the circle element
     */
    circle = 'rs-progressspinner-circle'
}

export interface ProgressSpinnerStyle extends BaseStyle {}
