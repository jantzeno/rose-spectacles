/**
 *
 * Fieldset is a grouping component with the optional content toggle feature.
 *
 * [Live Demo](https://openvue.dev/fieldset/)
 *
 * @module fieldsetstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum FieldsetClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-fieldset',
    /**
     * Class name of the legend element
     */
    legend = 'rs-fieldset-legend',
    /**
     * Class name of the legend label element
     */
    legendLabel = 'rs-fieldset-legend-label',
    /**
     * Class name of the toggle icon element
     */
    toggleIcon = 'rs-fieldset-toggle-icon',
    /**
     * Class name of the content container element
     */
    contentContainer = 'rs-fieldset-content-container',
    /**
     * Class name of the content element
     */
    content = 'rs-fieldset-content'
}

export interface FieldsetStyle extends BaseStyle {}
