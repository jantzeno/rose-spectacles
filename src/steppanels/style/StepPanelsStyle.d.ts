/**
 *
 * StepPanels
 *
 * [Live Demo](https://openvue.dev/stepper/)
 *
 * @module steppanelsstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum StepPanelsClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-steppanels'
}

export interface StepPanelsStyle extends BaseStyle {}

declare const style: StepPanelsStyle;
export default style;
