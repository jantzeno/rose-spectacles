/**
 *
 * RadioButtonGroup is a component that groups multiple radio buttons, allowing users to select only one option from the group.
 *
 *
 * @module radiobuttongroupstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum RadioButtonGroupClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-radiobutton-group'
}

export interface RadioButtonGroupStyle extends BaseStyle {}

declare const style: RadioButtonGroupStyle;
export default style;
