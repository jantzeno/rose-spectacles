/**
 *
 * TabList is a helper component for Tabs component.
 *
 *
 * @module tabliststyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum TabListClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-tablist',
    /**
     * Class name of the content element
     */
    content = 'rs-tablist-content',
    /**
     * Class name of the tabs element
     */
    tabList = 'rs-tablist-tab-list',
    /**
     * Class name of the activebar element
     */
    activeBar = 'rs-tablist-active-bar',
    /**
     * Class name of the previous button element
     */
    prevButton = 'rs-tablist-prev-button',
    /**
     * Class name of the next button element
     */
    nextButton = 'rs-tablist-next-button'
}

export interface TabListStyle extends BaseStyle {}

declare const style: TabListStyle;
export default style;
