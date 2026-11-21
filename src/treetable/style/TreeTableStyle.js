import { style } from '../../internal/styles/treetable/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ instance, props }) => [
        'rs-treetable rs-component',
        {
            'rs-treetable-hoverable': props.rowHover || instance.rowSelectionMode,
            'rs-treetable-resizable': props.resizableColumns,
            'rs-treetable-resizable-fit': props.resizableColumns && props.columnResizeMode === 'fit',
            'rs-treetable-scrollable': props.scrollable,
            'rs-treetable-flex-scrollable': props.scrollable && props.scrollHeight === 'flex',
            'rs-treetable-gridlines': props.showGridlines,
            'rs-treetable-sm': props.size === 'small',
            'rs-treetable-lg': props.size === 'large'
        }
    ],
    loading: 'rs-treetable-loading', //TODO: required?
    mask: 'rs-treetable-mask rs-overlay-mask',
    loadingIcon: 'rs-treetable-loading-icon',
    header: 'rs-treetable-header',
    paginator: ({ position }) => 'rs-treetable-paginator-' + position,
    tableContainer: 'rs-treetable-table-container',
    table: ({ props }) => [
        'rs-treetable-table',
        {
            'rs-treetable-scrollable-table': props.scrollable,
            'rs-treetable-resizable-table': props.resizableColumns,
            'rs-treetable-resizable-table-fit': props.resizableColumns && props.columnResizeMode === 'fit'
        }
    ],
    thead: 'rs-treetable-thead',
    headerCell: ({ instance, props, filterCell }) =>
        filterCell
            ? [
                  'rs-treetable-header-cell',
                  {
                      'rs-treetable-frozen-column': instance.columnProp('frozen')
                  }
              ]
            : [
                  'rs-treetable-header-cell',
                  {
                      'rs-treetable-sortable-column': instance.columnProp('sortable'),
                      'rs-treetable-resizable-column': props.resizableColumns,
                      'rs-treetable-column-sorted': instance.columnProp('sortable') ? instance.isColumnSorted() : false,
                      'rs-treetable-frozen-column': instance.columnProp('frozen')
                  }
              ],
    columnResizer: 'rs-treetable-column-resizer',
    columnHeaderContent: 'rs-treetable-column-header-content',
    columnTitle: 'rs-treetable-column-title',
    sortIcon: 'rs-treetable-sort-icon',
    pcSortBadge: 'rs-treetable-sort-badge',
    filter: ({ props }) => [
        'rs-treetable-filter',
        {
            'rs-treetable-inline-filter': props.display === 'row',
            'rs-treetable-popover-filter': props.display === 'menu'
        }
    ],
    filterElementContainer: 'rs-treetable-filter-element-container',
    pcColumnFilterButton: 'rs-treetable-column-filter-button',
    pcColumnFilterClearButton: 'rs-treetable-column-filter-clear-button',
    filterOverlay: ({ props }) => [
        'rs-treetable-filter-overlay rs-component',
        {
            'rs-treetable-filter-overlay-popover': props.display === 'menu'
        }
    ],
    filterConstraintList: 'rs-treetable-filter-constraint-list',
    filterConstraint: ({ instance, matchMode }) => [
        'rs-treetable-filter-constraint',
        {
            'rs-treetable-filter-constraint-selected': matchMode && instance.isRowMatchModeSelected(matchMode.value)
        }
    ],
    filterConstraintSeparator: 'rs-treetable-filter-constraint-separator',
    filterOperator: 'rs-treetable-filter-operator',
    pcFilterOperatorDropdown: 'rs-treetable-filter-operator-dropdown',
    filterRuleList: 'rs-treetable-filter-rule-list',
    filterRule: 'rs-treetable-filter-rule',
    pcFilterConstraintDropdown: 'rs-treetable-filter-constraint-dropdown',
    pcFilterRemoveRuleButton: 'rs-treetable-filter-remove-rule-button',
    pcFilterAddRuleButton: 'rs-treetable-filter-add-rule-button',
    filterButtonbar: 'rs-treetable-filter-buttonbar',
    pcFilterClearButton: 'rs-treetable-filter-clear-button',
    pcFilterApplyButton: 'rs-treetable-filter-apply-button',
    tbody: 'rs-treetable-tbody',
    row: ({ props, instance }) => [
        {
            'rs-treetable-selectable-row': instance.$parentInstance.rowSelectionMode,
            'rs-treetable-row-selected': instance.selected,
            'rs-treetable-contextmenu-row-selected': props.contextMenuSelection && instance.isSelectedWithContextMenu
        }
    ],
    bodyCell: ({ instance }) => [
        {
            'rs-treetable-frozen-column': instance.columnProp('frozen')
        }
    ],
    bodyCellContent: ({ instance }) => [
        'rs-treetable-body-cell-content',
        {
            'rs-treetable-body-cell-content-expander': instance.columnProp('expander')
        }
    ],
    nodeToggleButton: 'rs-treetable-node-toggle-button',
    nodeToggleIcon: 'rs-treetable-node-toggle-icon',
    pcNodeCheckbox: 'rs-treetable-node-checkbox',
    emptyMessage: 'rs-treetable-empty-message',
    tfoot: 'rs-treetable-tfoot',
    footerCell: ({ instance }) => [
        {
            'rs-treetable-frozen-column': instance.columnProp('frozen')
        }
    ],
    footer: 'rs-treetable-footer',
    columnResizeIndicator: 'rs-treetable-column-resize-indicator'
};

const inlineStyles = {
    tableContainer: { overflow: 'auto' },
    thead: { position: 'sticky' },
    tfoot: { position: 'sticky' }
};

export default BaseStyle.extend({
    name: 'treetable',
    style,
    classes,
    inlineStyles
});
