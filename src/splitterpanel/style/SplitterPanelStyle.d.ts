/**
 *
 * SplitterPanel is a helper component for Splitter component.
 *
 * [Live Demo](https://openvue.dev/splitter/)
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
