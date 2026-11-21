/**
 *
 * ColorPicker groups a collection of contents in tabs.
 *
 * [Live Demo](https://openvue.dev/colorpicker/)
 *
 * @module colorpickerstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum ColorPickerClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-colorpicker',
    /**
     * Class name of the preview element
     */
    preview = 'rs-colorpicker-preview',
    /**
     * Class name of the panel element
     */
    panel = 'rs-colorpicker-panel',
    /**
     * Class name of the color selector element
     */
    colorSelector = 'rs-colorpicker-color-selector',
    /**
     * Class name of the color background element
     */
    colorBackground = 'rs-colorpicker-color-background',
    /**
     * Class name of the color handle element
     */
    colorHandle = 'rs-colorpicker-color-handle',
    /**
     * Class name of the hue element
     */
    hue = 'rs-colorpicker-hue',
    /**
     * Class name of the hue handle element
     */
    hueHandle = 'rs-colorpicker-hue-handle'
}

export interface ColorPickerStyle extends BaseStyle {}

declare const style: ColorPickerStyle;
export default style;
