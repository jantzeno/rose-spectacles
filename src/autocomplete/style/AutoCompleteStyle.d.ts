/**
 *
 * AutoComplete is an input component that provides real-time suggestions while being typed.
 *
 * [Live Demo](https://openvue.dev/autocomplete/)
 *
 * @module autocompletestyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum AutoCompleteClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-autocomplete',
    /**
     * Class name of the input element
     */
    pcInput = 'rs-autocomplete-input',
    /**
     * Class name of the input multiple element
     */
    inputMultiple = 'rs-autocomplete-input-multiple',
    /**
     * Class name of the clear icon element
     */
    clearIcon = 'rs-autocomplete-clear-icon',
    /**
     * Class name of the chip item element
     */
    chipItem = 'rs-autocomplete-chip-item',
    /**
     * Class name of the chip element
     */
    pcChip = 'rs-autocomplete-chip',
    /**
     * Class name of the chip icon element
     */
    chipIcon = 'rs-autocomplete-chip-icon',
    /**
     * Class name of the input chip element
     */
    inputChip = 'rs-autocomplete-input-chip',
    /**
     * Class name of the loader element
     */
    loader = 'rs-autocomplete-loader',
    /**
     * Class name of the dropdown element
     */
    dropdown = 'rs-autocomplete-dropdown',
    /**
     * Class name of the panel element
     */
    panel = 'rs-autocomplete-overlay',
    /**
     * Class name of the list element
     */
    list = 'rs-autocomplete-list',
    /**
     * Class name of the list container element
     */
    listContainer = 'rs-autocomplete-list-container',
    /**
     * Class name of the option group element
     */
    optionGroup = 'rs-autocomplete-option-group',
    /**
     * Class name of the option element
     */
    option = 'rs-autocomplete-option',
    /**
     * Class name of the empty message element
     */
    emptyMessage = 'rs-autocomplete-empty-message'
}

export interface AutoCompleteStyle extends BaseStyle {}
