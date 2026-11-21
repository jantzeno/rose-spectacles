/**
 *
 * ListBox is used to select one or more values from a list of items.
 *
 *
 * @module listboxstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum ListboxClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-listbox',
    /**
     * Class name of the header element
     */
    header = 'rs-listbox-header',
    /**
     * Class name of the filter element
     */
    pcFilter = 'rs-listbox-filter',
    /**
     * Class name of the list container element
     */
    listContainer = 'rs-listbox-list-container',
    /**
     * Class name of the list element
     */
    list = 'rs-listbox-list',
    /**
     * Class name of the group container.
     */
    group = 'rs-listbox-group',
    /**
     * Class name of the option group element
     */
    optionGroup = 'rs-listbox-option-group',
    /**
     * Class name of the option element
     */
    option = 'rs-listbox-option',
    /**
     * Class name of the option check icon element
     */
    optionCheckIcon = 'rs-listbox-option-check-icon',
    /**
     * Class name of the option blank icon element
     */
    optionBlankIcon = 'rs-listbox-option-blank-icon',
    /**
     * Class name of the empty message element
     */
    emptyMessage = 'rs-listbox-empty-message'
}

export interface ListboxStyle extends BaseStyle {}

declare const style: ListboxStyle;
export default style;
