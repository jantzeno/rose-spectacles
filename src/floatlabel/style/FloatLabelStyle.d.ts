/**
 *
 * FloatLabel visually integrates a label with its form element.
 *
 * [Live Demo](https://openvue.dev/floatlabel/)
 *
 * @module floatlabelstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum FloatLabelClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-floatlabel'
}

export interface FloatLabelStyle extends BaseStyle {}

declare const style: FloatLabelStyle;
export default style;
