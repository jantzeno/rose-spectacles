/**
 *
 * SelectButton is used to choose single or multiple items from a list using buttons.
 *
 *
 * @module selectbuttonstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum SelectButtonClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-selectbutton'
}

export interface SelectButtonStyle extends BaseStyle {}

declare const style: SelectButtonStyle;
export default style;
