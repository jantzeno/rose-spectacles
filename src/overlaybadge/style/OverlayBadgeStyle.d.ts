/**
 *
 * OverlayBadge wraps an input and an icon.
 *
 *
 * @module overlaybadgestyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum OverlayBadgeClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-overlaybadge'
}

export interface OverlayBadgeStyle extends BaseStyle {}

declare const style: OverlayBadgeStyle;
export default style;
