/**
 *
 * InputGroup displays text, icon, buttons and other content can be grouped next to an input.
 *
 * [Live Demo](https://openvue.dev/inputgroup/)
 *
 * @module inputgroupstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum InputGroupClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-inputgroup'
}

export interface InputGroupStyle extends BaseStyle {}

declare const style: InputGroupStyle;
export default style;
