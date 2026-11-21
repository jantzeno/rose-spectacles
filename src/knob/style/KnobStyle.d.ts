/**
 *
 * Knob is a form component to define number inputs with a dial.
 *
 *
 * @module knobstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum KnobClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-knob',
    /**
     * Class name of the range element
     */
    range = 'rs-knob-range',
    /**
     * Class name of the value element
     */
    value = 'rs-knob-value',
    /**
     * Class name of the text element
     */
    text = 'rs-knob-text'
}

export interface KnobStyle extends BaseStyle {}

declare const style: KnobStyle;
export default style;
