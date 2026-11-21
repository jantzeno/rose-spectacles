/**
 *
 * DataTable displays data in tabular format.
 *
 * [Live Demo](https://openvue.dev/datatable/)
 *
 * @module datatablestyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum DataTableClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-datatable',
    /**
     * Class name of the mask element
     */
    mask = 'rs-datatable-mask',
    /**
     * Class name of the loading icon element
     */
    loadingIcon = 'rs-datatable-loading-icon',
    /**
     * Class name of the header element
     */
    header = 'rs-datatable-header',
    /**
     * Class name of the paginator element
     */
    pcPaginator = 'rs-datatable-paginator-[position]',
    /**
     * Class name of the table container element
     */
    tableContainer = 'rs-datatable-table-container',
    /**
     * Class name of the table element
     */
    table = 'rs-datatable-table',
    /**
     * Class name of the thead element
     */
    thead = 'rs-datatable-thead',
    /**
     * Class name of the column resizer element
     */
    columnResizer = 'rs-datatable-column-resizer',
    /**
     * Class name of the column header content element
     */
    columnHeaderContent = 'rs-datatable-column-header-content',
    /**
     * Class name of the column title element
     */
    columnTitle = 'rs-datatable-column-title',
    /**
     * Class name of the sort icon element
     */
    sortIcon = 'rs-datatable-sort-icon',
    /**
     * Class name of the sort badge element
     */
    pcSortBadge = 'rs-datatable-sort-badge',
    /**
     * Class name of the filter element
     */
    filter = 'rs-datatable-filter',
    /**
     * Class name of the filter element container element
     */
    filterElementContainer = 'rs-datatable-filter-element-container',
    /**
     * Class name of the column filter button element
     */
    pcColumnFilterButton = 'rs-datatable-column-filter-button',
    /**
     * Class name of the column filter clear button element
     */
    pcColumnFilterClearButton = 'rs-datatable-column-filter-clear-button',
    /**
     * Class name of the filter overlay element
     */
    filterOverlay = 'rs-datatable-filter-overlay',
    /**
     * Class name of the filter constraint list element
     */
    filterConstraintList = 'rs-datatable-filter-constraint-list',
    /**
     * Class name of the filter constraint element
     */
    filterConstraint = 'rs-datatable-filter-constraint',
    /**
     * Class name of the filter constraint separator element
     */
    filterConstraintSeparator = 'rs-datatable-filter-constraint-separator',
    /**
     * Class name of the filter operator element
     */
    filterOperator = 'rs-datatable-filter-operator',
    /**
     * Class name of the filter operator dropdown element
     */
    pcFilterOperatorDropdown = 'rs-datatable-filter-operator-dropdown',
    /**
     * Class name of the filter rule list element
     */
    filterRuleList = 'rs-datatable-filter-rule-list',
    /**
     * Class name of the filter rule element
     */
    filterRule = 'rs-datatable-filter-rule',
    /**
     * Class name of the filter constraint dropdown element
     */
    pcFilterConstraintDropdown = 'rs-datatable-filter-constraint-dropdown',
    /**
     * Class name of the filter remove rule button element
     */
    pcFilterRemoveRuleButton = 'rs-datatable-filter-remove-rule-button',
    /**
     * Class name of the filter add rule button element
     */
    pcFilterAddRuleButton = 'rs-datatable-filter-add-rule-button',
    /**
     * Class name of the filter buttonbar element
     */
    filterButtonbar = 'rs-datatable-filter-buttonbar',
    /**
     * Class name of the filter clear button element
     */
    pcFilterClearButton = 'rs-datatable-filter-clear-button',
    /**
     * Class name of the filter apply button element
     */
    pcFilterApplyButton = 'rs-datatable-filter-apply-button',
    /**
     * Class name of the tbody element
     */
    tbody = 'rs-datatable-tbody',
    /**
     * Class name of the row group header element
     */
    rowGroupHeader = 'rs-datatable-row-group-header',
    /**
     * Class name of the row toggle button element
     */
    rowToggleButton = 'rs-datatable-row-toggle-button',
    /**
     * Class name of the row toggle icon element
     */
    rowToggleIcon = 'rs-datatable-row-toggle-icon',
    /**
     * Class name of the row expansion element
     */
    rowExpansion = 'rs-datatable-row-expansion',
    /**
     * Class name of the row group footer element
     */
    rowGroupFooter = 'rs-datatable-row-group-footer',
    /**
     * Class name of the empty message element
     */
    emptyMessage = 'rs-datatable-empty-message',
    /**
     * Class name of the reorderable row handle element
     */
    reorderableRowHandle = 'rs-datatable-reorderable-row-handle',
    /**
     * Class name of the row editor init element
     */
    pcRowEditorInit = 'rs-datatable-row-editor-init',
    /**
     * Class name of the row editor save element
     */
    pcRowEditorSave = 'rs-datatable-row-editor-save',
    /**
     * Class name of the row editor cancel element
     */
    pcRowEditorCancel = 'rs-datatable-row-editor-cancel',
    /**
     * Class name of the tfoot element
     */
    tfoot = 'rs-datatable-tfoot',
    /**
     * Class name of the virtual scroller spacer element
     */
    virtualScrollerSpacer = 'rs-datatable-virtualscroller-spacer',
    /**
     * Class name of the footer element
     */
    footer = 'rs-datatable-footer',
    /**
     * Class name of the column resize indicator element
     */
    columnResizeIndicator = 'rs-datatable-column-resize-indicator',
    /**
     * Class name of the row reorder indicator up element
     */
    rowReorderIndicatorUp = 'rs-datatable-row-reorder-indicator-up',
    /**
     * Class name of the row reorder indicator down element
     */
    rowReorderIndicatorDown = 'rs-datatable-row-reorder-indicator-down'
}

export interface DataTableStyle extends BaseStyle {}
