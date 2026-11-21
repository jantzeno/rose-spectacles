/**
 *
 * Select also known as Select, is used to choose an item from a collection of options.
 *
 * [Live Demo](https://openvue.dev/select/)
 *
 * @module selectstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum SelectClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-select',
    /**
     * Class name of the label element
     */
    label = 'rs-select-label',
    /**
     * Class name of the clear icon element
     */
    clearIcon = 'rs-select-clear-icon',
    /**
     * Class name of the dropdown element
     */
    dropdown = 'rs-select-dropdown',
    /**
     * Class name of the loadingicon element
     */
    loadingicon = 'rs-select-loading-icon',
    /**
     * Class name of the dropdown icon element
     */
    dropdownIcon = 'rs-select-dropdown-icon',
    /**
     * Class name of the overlay element
     */
    overlay = 'rs-select-overlay',
    /**
     * Class name of the header element
     */
    header = 'rs-select-header',
    /**
     * Class name of the filter element
     */
    pcFilter = 'rs-select-filter',
    /**
     * Class name of the list container element
     */
    listContainer = 'rs-select-list-container',
    /**
     * Class name of the list element
     */
    list = 'rs-select-list',
    /**
     * Class name of the option group element
     */
    optionGroup = 'rs-select-option-group',
    /**
     * Class name of the option group label element
     */
    optionGroupLabel = 'rs-select-option-group-label',
    /**
     * Class name of the option element
     */
    option = 'rs-select-option',
    /**
     * Class name of the option label element
     */
    optionLabel = 'rs-select-option-label',
    /**
     * Class name of the option check icon element
     */
    optionCheckIcon = 'rs-select-option-check-icon',
    /**
     * Class name of the option blank icon element
     */
    optionBlankIcon = 'rs-select-option-blank-icon',
    /**
     * Class name of the empty message element
     */
    emptyMessage = 'rs-select-empty-message'
}

export interface SelectStyle extends BaseStyle {}

declare const style: SelectStyle;
export default style;
