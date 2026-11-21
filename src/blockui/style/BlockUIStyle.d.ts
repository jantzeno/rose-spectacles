/**
 *
 * BlockUI represents people using icons, labels and images.
 *
 * [Live Demo](https://openvue.dev/blockui)
 *
 * @module blockuistyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum BlockUIClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-blockui'
}

export interface BlockUIStyle extends BaseStyle {}

declare const style: BlockUIStyle;
export default style;
