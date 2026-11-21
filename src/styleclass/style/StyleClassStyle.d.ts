/**
 *
 * StyleClass manages css classes declaratively to during enter/leave animations or just to toggle classes on an element.
 *
 *
 * @module styleclassstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum StyleClassClasses {}

export interface StyleClassStyle extends BaseStyle {}

declare const style: StyleClassStyle;
export default style;
