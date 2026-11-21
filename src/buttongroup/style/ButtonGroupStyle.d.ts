/**
 *
 * A set of Buttons can be displayed together using the ButtonGroup component.
 *
 *
 * @module buttongroupstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum ButtonGroupClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-buttongroup'
}

export interface ButtonGroupStyle extends BaseStyle {}

declare const style: ButtonGroupStyle;
export default style;
