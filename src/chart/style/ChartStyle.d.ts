/**
 *
 * Chart styles.
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
    root = 'rs-chart',
    plot = 'rs-chart-plot',
    legend = 'rs-chart-legend'
}

export interface ChartStyle extends BaseStyle {}

declare const style: ChartStyle;
export default style;
