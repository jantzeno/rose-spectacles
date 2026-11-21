/**
 *
 * AccordionPanel is a helper component for Accordion component.
 *
 *
 * @module accordionpanelstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum AccordionPanelClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-accordionpanel'
}

export interface AccordionPanelStyle extends BaseStyle {}

declare const style: AccordionPanelStyle;
export default style;
