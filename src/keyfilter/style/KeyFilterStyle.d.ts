/**
 *
 * A keyfilter is a directive used to block individual keystrokes based on a pattern.
 *
 *
 * @module keyfilterstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum KeyFilterClasses {}

export interface KeyFilterStyle extends BaseStyle {}

declare const style: KeyFilterStyle;
export default style;
