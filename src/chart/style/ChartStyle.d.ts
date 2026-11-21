/**
 *
 * Chart groups a collection of contents in tabs.
 *
 *
 * @module chartstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum ChartClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-chart'
}

export interface ChartStyle extends BaseStyle {}

declare const style: ChartStyle;
export default style;
