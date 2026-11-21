/**
 *
 * ScrollTop gets displayed after a certain scroll position and used to navigates to the top of the page quickly.
 *
 * [Live Demo](https://openvue.dev/scrolltop/)
 *
 * @module scrolltopstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum ScrollTopClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-scrolltop',
    /**
     * Class name of the icon element
     */
    icon = 'rs-scrolltop-icon'
}

export interface ScrollTopStyle extends BaseStyle {}
