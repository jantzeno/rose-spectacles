/**
 *
 * InputIcon displays an icon.
 *
 *
 * @module inputiconstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum InputIconClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-inputicon'
}

export interface InputIconStyle extends BaseStyle {}

declare const style: InputIconStyle;
export default style;
