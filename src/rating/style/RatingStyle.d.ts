/**
 *
 * Rating component is a star based selection input.
 *
 * [Live Demo](https://openvue.dev/rating/)
 *
 * @module ratingstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum RatingClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-rating',
    /**
     * Class name of the option element
     */
    option = 'rs-rating-option',
    /**
     * Class name of the on icon element
     */
    onIcon = 'rs-rating-on-icon',
    /**
     * Class name of the off icon element
     */
    offIcon = 'rs-rating-off-icon'
}

export interface RatingStyle extends BaseStyle {}
