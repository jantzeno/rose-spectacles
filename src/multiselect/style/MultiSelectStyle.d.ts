/**
 *
 * MultiSelect is used to select multiple items from a collection.
 *
 * [Live Demo](https://openvue.dev/multiselect/)
 *
 * @module multiselectstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum MultiSelectClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-multiselect',
    /**
     * Class name of the label container element
     */
    labelContainer = 'rs-multiselect-label-container',
    /**
     * Class name of the label element
     */
    label = 'rs-multiselect-label',
    /**
     * Class name of the clear icon element
     */
    clearIcon = 'rs-multiselect-clear-icon',
    /**
     * Class name of the chip item element
     */
    chipItem = 'rs-multiselect-chip-item',
    /**
     * Class name of the chip element
     */
    pcChip = 'rs-multiselect-chip',
    /**
     * Class name of the chip icon element
     */
    chipIcon = 'rs-multiselect-chip-icon',
    /**
     * Class name of the dropdown element
     */
    dropdown = 'rs-multiselect-dropdown',
    /**
     * Class name of the loading icon element
     */
    loadingIcon = 'rs-multiselect-loading-icon',
    /**
     * Class name of the dropdown icon element
     */
    dropdownIcon = 'rs-multiselect-dropdown-icon',
    /**
     * Class name of the overlay element
     */
    overlay = 'rs-multiselect-overlay',
    /**
     * Class name of the header element
     */
    header = 'rs-multiselect-header',
    /**
     * Class name of the filter container element
     */
    pcFilterContainer = 'rs-multiselect-filter-container',
    /**
     * Class name of the filter element
     */
    pcFilter = 'rs-multiselect-filter',
    /**
     * Class name of the list container element
     */
    listContainer = 'rs-multiselect-list-container',
    /**
     * Class name of the list element
     */
    list = 'rs-multiselect-list',
    /**
     * Class name of the option group element
     */
    optionGroup = 'rs-multiselect-option-group',
    /**
     * Class name of the option element
     */
    option = 'rs-multiselect-option',
    /**
     * Class name of the empty message element
     */
    emptyMessage = 'rs-multiselect-empty-message'
}

export interface MultiSelectStyle extends BaseStyle {}
