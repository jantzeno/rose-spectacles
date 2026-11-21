/**
 *
 * StepPanel is a helper component for Stepper component.
 *
 *
 * @module steppanelstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum StepPanelClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-steppanel'
}

export interface StepPanelStyle extends BaseStyle {}

declare const style: StepPanelStyle;
export default style;
