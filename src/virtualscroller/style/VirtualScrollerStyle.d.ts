/**
 *
 * VirtualScroller is a performant approach to handle huge data efficiently.
 *
 * [Live Demo](https://openvue.dev/virtualscroller/)
 *
 * @module virtualscrollerstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum VirtualScrollerClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-virtualscroller',
    /**
     * Class name of the content element
     */
    content = 'rs-virtualscroller-content',
    /**
     * Class name of the spacer element
     */
    spacer = 'rs-virtualscroller-spacer',
    /**
     * Class name of the loader element
     */
    loader = 'rs-virtualscroller-loader',
    /**
     * Class name of the loading icon element
     */
    loadingIcon = 'rs-virtualscroller-loading-icon'
}

export interface VirtualScrollerStyle extends BaseStyle {}
