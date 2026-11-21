/**
 *
 * ProgressBar is a process status indicator.
 *
 * [Live Demo](https://openvue.dev/progressbar)
 *
 * @module progressbarstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum ProgressBarClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-progressbar',
    /**
     * Class name of the value element
     */
    value = 'rs-progressbar-value',
    /**
     * Class name of the label element
     */
    label = 'rs-progressbar-label'
}

export interface ProgressBarStyle extends BaseStyle {}

declare const style: ProgressBarStyle;
export default style;
