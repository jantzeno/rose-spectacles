/**
 *
 * Divider is used to separate contents.
 *
 *
 * @module dividerstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum DividerClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-divider',
    /**
     * Class name of the content element
     */
    content = 'rs-divider-content'
}

export interface DividerStyle extends BaseStyle {}

declare const style: DividerStyle;
export default style;
