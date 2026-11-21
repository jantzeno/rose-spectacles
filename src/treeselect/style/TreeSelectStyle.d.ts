/**
 *
 * TreeSelect is a form component to choose from hierarchical data.
 *
 * [Live Demo](https://openvue.dev/treeselect/)
 *
 * @module treeselectstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum TreeSelectClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-treeselect',
    /**
     * Class name of the label container element
     */
    labelContainer = 'rs-treeselect-label-container',
    /**
     * Class name of the label element
     */
    label = 'rs-treeselect-label',
    /**
     * Class name of the clear icon element
     */
    clearIcon = 'rs-select-clear-icon',
    /**
     * Class name of the chip item element
     */
    chipItem = 'rs-treeselect-chip-item',
    /**
     * Class name of the chip element
     */
    pcChip = 'rs-treeselect-chip',
    /**
     * Class name of the dropdown element
     */
    dropdown = 'rs-treeselect-dropdown',
    /**
     * Class name of the dropdown icon element
     */
    dropdownIcon = 'rs-treeselect-dropdown-icon',
    /**
     * Class name of the panel element
     */
    panel = 'rs-treeselect-overlay',
    /**
     * Class name of the tree container element
     */
    treeContainer = 'rs-treeselect-tree-container',
    /**
     * Class name of the empty message element
     */
    emptyMessage = 'rs-treeselect-empty-message'
}

export interface TreeSelectStyle extends BaseStyle {}

declare const style: TreeSelectStyle;
export default style;
