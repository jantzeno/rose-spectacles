/**
 *
 * SplitterPanel is a helper component for Splitter component.
 *
 *
 * @module splitterpanelstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum SplitterPanelClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-splitterpanel'
}

export interface SplitterPanelStyle extends BaseStyle {}

declare const style: SplitterPanelStyle;
export default style;
