/**
 *
 * DeferredContent postpones the loading the content that is initially not in the viewport until it becomes visible on scroll.
 *
 *
 * @module deferredcontentstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum DeferredContentClasses {}

export interface DeferredContentStyle extends BaseStyle {}

declare const style: DeferredContentStyle;
export default style;
