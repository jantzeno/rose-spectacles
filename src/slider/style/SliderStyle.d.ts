/**
 *
 * Slider is a component to provide input with a drag handle.
 *
 *
 * @module sliderstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum SliderClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-slider',
    /**
     * Class name of the range element
     */
    range = 'rs-slider-range',
    /**
     * Class name of the handle element
     */
    handle = 'rs-slider-handle'
}

export interface SliderStyle extends BaseStyle {}

declare const style: SliderStyle;
export default style;
