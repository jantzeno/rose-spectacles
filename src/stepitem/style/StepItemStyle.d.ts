/**
 *
 * StepItem is a helper component for Stepper component.
 *
 *
 * @module stepitemstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum StepItemClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-stepitem'
}

export interface StepItemStyle extends BaseStyle {}

declare const style: StepItemStyle;
export default style;
