/**
 *
 * IconField wraps an input and an icon.
 *
 *
 * @module iconfieldstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum IconFieldClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-iconfield'
}

export interface IconFieldStyle extends BaseStyle {}

declare const style: IconFieldStyle;
export default style;
