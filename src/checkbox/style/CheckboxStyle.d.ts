/**
 *
 * Checkbox is an extension to standard checkbox element with theming.
 *
 *
 * @module checkboxstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum CheckboxClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-checkbox',
    /**
     * Class name of the box element
     */
    box = 'rs-checkbox-box',
    /**
     * Class name of the input element
     */
    input = 'rs-checkbox-input',
    /**
     * Class name of the icon element
     */
    icon = 'rs-checkbox-icon'
}

export interface CheckboxStyle extends BaseStyle {}

declare const style: CheckboxStyle;
export default style;
