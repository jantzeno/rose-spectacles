/**
 *
 * Chip represents people using icons, labels and images.
 *
 *
 * @module chipstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum ChipClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-chip',
    /**
     * Class name of the image element
     */
    image = 'rs-chip-image',
    /**
     * Class name of the icon element
     */
    icon = 'rs-chip-icon',
    /**
     * Class name of the label element
     */
    label = 'rs-chip-label',
    /**
     * Class name of the remove icon element
     */
    removeIcon = 'rs-chip-remove-icon'
}

export interface ChipStyle extends BaseStyle {}

declare const style: ChipStyle;
export default style;
