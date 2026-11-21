/**
 *
 * StepList is a helper component for Stepper component.
 *
 *
 * @module stepliststyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum StepListClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-steplist'
}

export interface StepListStyle extends BaseStyle {}

declare const style: StepListStyle;
export default style;
