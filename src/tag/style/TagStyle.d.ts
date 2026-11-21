/**
 *
 * Tag component is used to categorize content.
 *
 * [Live Demo](https://openvue.dev/tag)
 *
 * @module tagstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum TagClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-tag',
    /**
     * Class name of the icon element
     */
    icon = 'rs-tag-icon',
    /**
     * Class name of the label element
     */
    label = 'rs-tag-label'
}

export interface TagStyle extends BaseStyle {}
