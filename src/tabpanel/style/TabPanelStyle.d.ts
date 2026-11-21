/**
 *
 * TabPanel is a helper component for Tabs component.
 *
 *
 * @module tabpanelstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum TabPanelClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-tabpanel'
}

export interface TabPanelStyle extends BaseStyle {}

declare const style: TabPanelStyle;
export default style;
