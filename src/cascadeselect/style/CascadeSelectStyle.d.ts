/**
 *
 * CascadeSelect is a form component to select a value from a nested structure of options.
 *
 * [Live Demo](https://openvue.dev/cascadeselect/)
 *
 * @module cascadeselectstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum CascadeSelectClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-cascadeselect',
    /**
     * Class name of the label element
     */
    label = 'rs-cascadeselect-label',
    /**
     * Class name of the dropdown element
     */
    dropdown = 'rs-cascadeselect-dropdown',
    /**
     * Class name of the loading icon element
     */
    loadingIcon = 'rs-cascadeselect-loading-icon',
    /**
     * Class name of the dropdown icon element
     */
    clearIcon = 'rs-cascadeselect-clear-icon',
    /**
     * Class name of the dropdown icon element
     */
    dropdownIcon = 'rs-cascadeselect-dropdown-icon',
    /**
     * Class name of the overlay element
     */
    overlay = 'rs-cascadeselect-overlay',
    /**
     * Class name of the list container element
     */
    listContainer = 'rs-cascadeselect-list-container',
    /**
     * Class name of the list element
     */
    list = 'rs-cascadeselect-list',
    /**
     * Class name of the item element
     */
    item = 'rs-cascadeselect-item',
    /**
     * Class name of the item content element
     */
    itemContent = 'rs-cascadeselect-item-content',
    /**
     * Class name of the item text element
     */
    itemText = 'rs-cascadeselect-item-text',
    /**
     * Class name of the group icon element
     */
    groupIcon = 'rs-cascadeselect-group-icon',
    /**
     * Class name of the item list element
     */
    itemList = 'rs-cascadeselect-item-list'
}

export interface CascadeSelectStyle extends BaseStyle {}

declare const style: CascadeSelectStyle;
export default style;
