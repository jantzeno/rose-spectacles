/**
 *
 * TabPanels is a helper component for Tabs component.
 *
 *
 * @module tabpanelsstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum TabPanelsClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-tabpanels'
}

export interface TabPanelsStyle extends BaseStyle {}

declare const style: TabPanelsStyle;
export default style;
