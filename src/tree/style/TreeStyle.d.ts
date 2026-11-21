/**
 *
 * Tree is used to display hierarchical data.
 *
 *
 * @module treestyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum TreeClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-tree',
    /**
     * Class name of the mask element
     */
    mask = 'rs-tree-mask',
    /**
     * Class name of the loading icon element
     */
    loadingIcon = 'rs-tree-loading-icon',
    /**
     * Class name of the filter input element
     */
    pcFilterInput = 'rs-tree-filter-input',
    /**
     * Class name of the wrapper element
     */
    wrapper = 'rs-tree-root',
    /**
     * Class name of the root children element
     */
    rootChildren = 'rs-tree-root-children',
    /**
     * Class name of the node element
     */
    node = 'rs-tree-node',
    /**
     * Class name of the node content element
     */
    nodeContent = 'rs-tree-node-content',
    /**
     * Class name of the node toggle button element
     */
    nodeToggleButton = 'rs-tree-node-toggle-button',
    /**
     * Class name of the node toggle icon element
     */
    nodeToggleIcon = 'rs-tree-node-toggle-icon',
    /**
     * Class name of the node checkbox element
     */
    nodeCheckbox = 'rs-tree-node-checkbox',
    /**
     * Class name of the node icon element
     */
    nodeIcon = 'rs-tree-node-icon',
    /**
     * Class name of the node label element
     */
    nodeLabel = 'rs-tree-node-label',
    /**
     * Class name of the node children element
     */
    nodeChildren = 'rs-tree-node-children'
}

export interface TreeStyle extends BaseStyle {}

declare const style: TreeStyle;
export default style;
