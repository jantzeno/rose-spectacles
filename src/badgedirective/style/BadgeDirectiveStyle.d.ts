/**
 *
 * Badge directive is a small status indicator for another element.
 *
 * [Live Demo](https://openvue.dev/badge)
 *
 * @module badgedirectivestyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum BadgeDirectiveClasses {
    root = 'rs-badge'
}

export interface BadgeDirectiveStyle extends BaseStyle {}

declare const style: BadgeDirectiveStyle;
export default style;
