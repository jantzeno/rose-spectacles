/**
 *
 * CheckboxGroup is a component that groups multiple checkboxes, allowing users to select one or more options.
 *
 *
 * @module checkboxgroupstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum CheckboxGroupClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-checkbox-group'
}

export interface CheckboxGroupStyle extends BaseStyle {}

declare const style: CheckboxGroupStyle;
export default style;
