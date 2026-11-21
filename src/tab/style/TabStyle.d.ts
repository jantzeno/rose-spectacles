/**
 *
 * Tab is a helper component for Tabs component.
 *
 * [Live Demo](https://openvue.dev/tabs/)
 *
 * @module tabstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum TabClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-tab'
}

export interface TabStyle extends BaseStyle {}

declare const style: TabStyle;
export default style;
