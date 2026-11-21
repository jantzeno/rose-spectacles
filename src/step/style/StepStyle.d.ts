/**
 *
 * Step is a helper component for Stepper component.
 *
 *
 * @module stepstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum StepClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-step',
    /**
     * Class name of the header element
     */
    header = 'rs-step-header',
    /**
     * Class name of the number element
     */
    number = 'rs-step-number',
    /**
     * Class name of the title element
     */
    title = 'rs-step-title'
}

export interface StepStyle extends BaseStyle {}

declare const style: StepStyle;
export default style;
