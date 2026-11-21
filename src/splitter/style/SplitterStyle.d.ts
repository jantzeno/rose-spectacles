/**
 *
 * Splitter is utilized to separate and resize panels.
 *
 *
 * @module splitterstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum SplitterClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-splitter',
    /**
     * Class name of the gutter element
     */
    gutter = 'rs-splitter-gutter',
    /**
     * Class name of the gutter handle element
     */
    gutterHandle = 'rs-splitter-gutter-handle'
}

export interface SplitterStyle extends BaseStyle {}

declare const style: SplitterStyle;
export default style;
