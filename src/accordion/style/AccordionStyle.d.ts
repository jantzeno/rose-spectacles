/**
 *
 * Accordion groups a collection of contents in tabs.
 *
 * [Live Demo](https://openvue.dev/accordion/)
 *
 * @module accordionstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum AccordionClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-accordion'
}

export interface AccordionStyle extends BaseStyle {}

declare const style: AccordionStyle;
export default style;
