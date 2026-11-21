/**
 *
 * Skeleton is a placeholder to display instead of the actual content.
 *
 * [Live Demo](https://openvue.dev/skeleton/)
 *
 * @module skeletonstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum SkeletonClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-skeleton'
}

export interface SkeletonStyle extends BaseStyle {}

declare const style: SkeletonStyle;
export default style;
