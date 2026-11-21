/**
 *
 * AccordionHeader is a helper component for Accordion component.
 *
 * [Live Demo](https://openvue.dev/accordion/)
 *
 * @module accordionheaderstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum AccordionHeaderClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-accordionheader',
    /**
     * Class name of the toggleicon element
     */
    toggleicon = 'rs-accordionheader-toggle-icon'
}

export interface AccordionHeaderStyle extends BaseStyle {}
