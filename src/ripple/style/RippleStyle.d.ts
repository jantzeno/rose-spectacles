/**
 *
 * Ripple directive adds ripple effect to the host element.
 *
 * [Live Demo](https://openvue.dev/ripple)
 *
 * @module ripplestyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum RippleClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-ink'
}

export interface RippleStyle extends BaseStyle {}

declare const style: RippleStyle;
export default style;
