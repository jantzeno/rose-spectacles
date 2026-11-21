/**
 *
 * Tooltip directive provides advisory information for a component.
 *
 *
 * @module tooltipstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum TooltipClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-tooltip',
    /**
     * Class name of the arrow element
     */
    arrow = 'rs-tooltip-arrow',
    /**
     * Class name of the text element
     */
    text = 'rs-tooltip-text'
}

export interface TooltipStyle extends BaseStyle {}

declare const style: TooltipStyle;
export default style;
