/**
 *
 * Inplace provides an easy to do editing and display at the same time where clicking the output displays the actual content.
 *
 * [Live Demo](https://openvue.dev/inplace)
 *
 * @module inplacestyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum InplaceClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-inplace',
    /**
     * Class name of the display element
     */
    display = 'rs-inplace-display',
    /**
     * Class name of the content element
     */
    content = 'rs-inplace-content'
}

export interface InplaceStyle extends BaseStyle {}
