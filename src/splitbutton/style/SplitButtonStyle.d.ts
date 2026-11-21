/**
 *
 * SplitButton groups a set of commands in an overlay with a default command.
 *
 * [Live Demo](https://openvue.dev/splitbutton/)
 *
 * @module splitbuttonstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum SplitButtonClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-splitbutton',
    /**
     * Class name of the button element
     */
    pcButton = 'rs-splitbutton-button',
    /**
     * Class name of the dropdown element
     */
    pcDropdown = 'rs-splitbutton-dropdown'
}

export interface SplitButtonStyle extends BaseStyle {}

declare const style: SplitButtonStyle;
export default style;
