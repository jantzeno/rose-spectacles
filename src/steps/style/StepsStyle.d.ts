/**
 *
 * Steps components is an indicator for the steps in a wizard workflow. Example below uses nested routes with Steps.
 *
 * [Live Demo](https://openvue.dev/steps/)
 *
 * @module stepsstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum StepsClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-steps',
    /**
     * Class name of the list element
     */
    list = 'rs-steps-list',
    /**
     * Class name of the item element
     */
    item = 'rs-steps-item',
    /**
     * Class name of the item link element
     */
    itemLink = 'rs-steps-item-link',
    /**
     * Class name of the item number element
     */
    itemNumber = 'rs-steps-item-number',
    /**
     * Class name of the item label element
     */
    itemLabel = 'rs-steps-item-label'
}

export interface StepsStyle extends BaseStyle {}

declare const style: StepsStyle;
export default style;
