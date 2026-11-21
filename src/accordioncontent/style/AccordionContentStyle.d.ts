/**
 *
 * AccordionContent is a helper component for Accordion component.
 *
 *
 * @module accordioncontentstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum AccordionContentClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-accordioncontent',
    /**
     * Class name of the content element
     */
    content = 'rs-accordioncontent-content'
}

export interface AccordionContentStyle extends BaseStyle {}

declare const style: AccordionContentStyle;
export default style;
