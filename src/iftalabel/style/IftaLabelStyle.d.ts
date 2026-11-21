/**
 *
 * IftaLabel visually integrates a label within its form element.
 *
 *
 * @module iftalabelstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum IftaLabelClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-iftalabel'
}

export interface IftaLabelStyle extends BaseStyle {}

declare const style: IftaLabelStyle;
export default style;
