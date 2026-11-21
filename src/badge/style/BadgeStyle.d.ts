/**
 *
 * Badge represents people using icons, labels and images.
 *
 *
 * @module badgestyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum BadgeClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-badge'
}

export interface BadgeStyle extends BaseStyle {}

declare const style: BadgeStyle;
export default style;
