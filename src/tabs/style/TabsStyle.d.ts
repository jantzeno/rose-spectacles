/**
 *
 * Tabs facilitates seamless switching between different views.
 *
 *
 * @module tabsstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum TabsClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-tabs'
}

export interface TabsStyle extends BaseStyle {}

declare const style: TabsStyle;
export default style;
