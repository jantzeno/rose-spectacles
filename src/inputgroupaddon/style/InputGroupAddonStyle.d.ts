/**
 *
 * InputGroupAddon displays text, icon, buttons and other content can be grouped next to an input.
 *
 * [Live Demo](https://openvue.dev/inputgroup/)
 *
 * @module inputgroupaddonstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum InputGroupAddonClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-inputgroupaddon'
}

export interface InputGroupAddonStyle extends BaseStyle {}

declare const style: InputGroupAddonStyle;
export default style;
