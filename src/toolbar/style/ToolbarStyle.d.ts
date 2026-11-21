/**
 *
 * Toolbar is a grouping component for buttons and other content.
 *
 *
 * @module toolbarstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum ToolbarClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-toolbar',
    /**
     * Class name of the start element
     */
    start = 'rs-toolbar-start',
    /**
     * Class name of the center element
     */
    center = 'rs-toolbar-center',
    /**
     * Class name of the end element
     */
    end = 'rs-toolbar-end'
}

export interface ToolbarStyle extends BaseStyle {}

declare const style: ToolbarStyle;
export default style;
