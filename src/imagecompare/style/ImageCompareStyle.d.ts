/**
 *
 * ImageCompare compares two images side by side with a slider.
 *
 * [Live Demo](https://openvue.dev/imagecompare/)
 *
 * @module imagecomparestyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum ImageCompareClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-imagecompare',
    /**
     * Class name of the slider element
     */
    slider = 'rs-imagecompare-slider'
}

export interface ImageCompareStyle extends BaseStyle {}
