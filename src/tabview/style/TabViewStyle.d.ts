/**
 * @deprecated since v4. Use Tabs component instead.
 *
 * TabView is a container component to group content with tabs.
 *
 *
 * @module tabview
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum TabViewClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-tabview',
    /**
     * Class name of the nav container element
     */
    navContainer = 'rs-tabview-tablist-container',
    /**
     * Class name of the previous button element
     */
    prevButton = 'rs-tabview-prev-button',
    /**
     * Class name of the nav content element
     */
    navContent = 'rs-tabview-tablist-scroll-container',
    /**
     * Class name of the nav element
     */
    nav = 'rs-tabview-tablist',
    /**
     * Class name of the tab header element
     */
    tabHeader = 'rs-tabview-tablist-item',
    /**
     * Class name of the tab header action element
     */
    tabHeaderAction = 'rs-tabview-tab-header',
    /**
     * Class name of the tab header title element
     */
    tabHeaderTitle = 'rs-tabview-tab-title',
    /**
     * Class name of the tab content element
     */
    tabContent = 'rs-tabview-panel',
    /**
     * Class name of the inkbar element
     */
    inkbar = 'rs-tabview-ink-bar',
    /**
     * Class name of the next button element
     */
    nextButton = 'rs-tabview-next-button',
    /**
     * Class name of the panel container element
     */
    panelContainer = 'rs-tabview-panels'
}

export interface TabViewStyle extends BaseStyle {}

declare const style: TabViewStyle;
export default style;
