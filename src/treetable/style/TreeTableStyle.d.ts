/**
 *
 * TreeTable is used to display hierarchical data in tabular format.
 *
 * [Live Demo](https://openvue.dev/treetable/)
 *
 * @module treetablestyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum TreeTableClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-treetable',
    /**
     * Class name of the loading element
     */
    loading = 'rs-treetable-loading',
    /**
     * Class name of the mask element
     */
    mask = 'rs-treetable-mask',
    /**
     * Class name of the loading icon element
     */
    loadingIcon = 'rs-treetable-loading-icon',
    /**
     * Class name of the header element
     */
    header = 'rs-treetable-header',
    /**
     * Class name of the paginator element
     */
    paginator = 'rs-treetable-paginator-[position]',
    /**
     * Class name of the table container element
     */
    tableContainer = 'rs-treetable-table-container',
    /**
     * Class name of the table element
     */
    table = 'rs-treetable-table',
    /**
     * Class name of the thead element
     */
    thead = 'rs-treetable-thead',
    /**
     * Class name of the column resizer element
     */
    columnResizer = 'rs-treetable-column-resizer',
    /**
     * Class name of the column title element
     */
    columnTitle = 'rs-treetable-column-title',
    /**
     * Class name of the sort icon element
     */
    sortIcon = 'rs-treetable-sort-icon',
    /**
     * Class name of the sort badge element
     */
    pcSortBadge = 'rs-treetable-sort-badge',
    /**
     * Class name of the tbody element
     */
    tbody = 'rs-treetable-tbody',
    /**
     * Class name of the node toggle button element
     */
    nodeToggleButton = 'rs-treetable-node-toggle-button',
    /**
     * Class name of the node toggle icon element
     */
    nodeToggleIcon = 'rs-treetable-node-toggle-icon',
    /**
     * Class name of the node checkbox element
     */
    pcNodeCheckbox = 'rs-treetable-node-checkbox',
    /**
     * Class name of the empty message element
     */
    emptyMessage = 'rs-treetable-empty-message',
    /**
     * Class name of the tfoot element
     */
    tfoot = 'rs-treetable-tfoot',
    /**
     * Class name of the footer element
     */
    footer = 'rs-treetable-footer',
    /**
     * Class name of the column resize indicator element
     */
    columnResizeIndicator = 'rs-treetable-column-resize-indicator'
}

export interface TreeTableStyle extends BaseStyle {}

declare const style: TreeTableStyle;
export default style;
