/**
 *
 *  AnimateOnScroll manages CSS classes declaratively to during enter/leave animations on scroll or on page load.
 *
 *
 * @module animateonscrollstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum AnimateOnScrollClasses {}

export interface AnimateOnScrollStyle extends BaseStyle {}

declare const style: AnimateOnScrollStyle;
export default style;
