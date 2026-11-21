/**
 *
 * Stepper is a component that streamlines a wizard-like workflow, organizing content into coherent steps and visually guiding users through a numbered progression in a multi-step process.
 *
 *
 * @module stepperstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum StepperClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-stepper',
    /**
     * Class name of the separator element
     */
    separator = 'rs-stepper-separator'
}

export interface StepperStyle extends BaseStyle {}

declare const style: StepperStyle;
export default style;
