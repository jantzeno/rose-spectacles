import { style } from '../../internal/styles/datatable/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ props }: StyleContext) => [
        'rs-datatable rs-component',
        {
            'rs-datatable-hoverable': props.rowHover || props.selectionMode,
            'rs-datatable-resizable': props.resizableColumns,
            'rs-datatable-resizable-fit': props.resizableColumns && props.columnResizeMode === 'fit',
            'rs-datatable-scrollable': props.scrollable,
            'rs-datatable-flex-scrollable': props.scrollable && props.scrollHeight === 'flex',
            'rs-datatable-striped': props.stripedRows,
            'rs-datatable-gridlines': props.showGridlines,
            'rs-datatable-sm': props.size === 'small',
            'rs-datatable-lg': props.size === 'large'
        }
    ],
    mask: 'rs-datatable-mask rs-overlay-mask',
    loadingIcon: 'rs-datatable-loading-icon',
    header: 'rs-datatable-header',
    pcPaginator: ({ position }: StyleContext) => 'rs-datatable-paginator-' + position,
    tableContainer: 'rs-datatable-table-container',
    table: ({ props }: StyleContext) => [
        'rs-datatable-table',
        {
            'rs-datatable-scrollable-table': props.scrollable,
            'rs-datatable-resizable-table': props.resizableColumns,
            'rs-datatable-resizable-table-fit': props.resizableColumns && props.columnResizeMode === 'fit'
        }
    ],
    thead: 'rs-datatable-thead',
    headerCell: ({ instance, props, column }: StyleContext) =>
        column && !instance.columnProp('hidden') && (props.rowGroupMode !== 'subheader' || props.groupRowsBy !== instance.columnProp(column, 'field'))
            ? [
                  'rs-datatable-header-cell',
                  {
                      'rs-datatable-frozen-column': instance.columnProp('frozen')
                  }
              ]
            : [
                  'rs-datatable-header-cell',
                  {
                      'rs-datatable-sortable-column': instance.columnProp('sortable'),
                      'rs-datatable-resizable-column': instance.resizableColumns,
                      'rs-datatable-column-sorted': instance.isColumnSorted(),
                      'rs-datatable-frozen-column': instance.columnProp('frozen'),
                      'rs-datatable-reorderable-column': props.reorderableColumns
                  }
              ],
    columnResizer: 'rs-datatable-column-resizer',
    columnHeaderContent: 'rs-datatable-column-header-content',
    columnTitle: 'rs-datatable-column-title',
    columnFooter: 'rs-datatable-column-footer',
    sortIcon: 'rs-datatable-sort-icon',
    pcSortBadge: 'rs-datatable-sort-badge',
    filter: ({ props }: StyleContext) => [
        'rs-datatable-filter',
        {
            'rs-datatable-inline-filter': props.display === 'row',
            'rs-datatable-popover-filter': props.display === 'menu'
        }
    ],
    filterElementContainer: 'rs-datatable-filter-element-container',
    pcColumnFilterButton: 'rs-datatable-column-filter-button',
    pcColumnFilterClearButton: 'rs-datatable-column-filter-clear-button',
    filterOverlay: ({ props }: StyleContext) => [
        'rs-datatable-filter-overlay rs-component',
        {
            'rs-datatable-filter-overlay-popover': props.display === 'menu'
        }
    ],
    filterConstraintList: 'rs-datatable-filter-constraint-list',
    filterConstraint: ({ instance, matchMode }: StyleContext) => [
        'rs-datatable-filter-constraint',
        {
            'rs-datatable-filter-constraint-selected': matchMode && instance.isRowMatchModeSelected(matchMode.value)
        }
    ],
    filterConstraintSeparator: 'rs-datatable-filter-constraint-separator',
    filterOperator: 'rs-datatable-filter-operator',
    pcFilterOperatorDropdown: 'rs-datatable-filter-operator-dropdown',
    filterRuleList: 'rs-datatable-filter-rule-list',
    filterRule: 'rs-datatable-filter-rule',
    pcFilterConstraintDropdown: 'rs-datatable-filter-constraint-dropdown',
    pcFilterRemoveRuleButton: 'rs-datatable-filter-remove-rule-button',
    pcFilterAddRuleButton: 'rs-datatable-filter-add-rule-button',
    filterButtonbar: 'rs-datatable-filter-buttonbar',
    pcFilterClearButton: 'rs-datatable-filter-clear-button',
    pcFilterApplyButton: 'rs-datatable-filter-apply-button',
    tbody: ({ props }: StyleContext) => (props.frozenRow ? 'rs-datatable-tbody rs-datatable-frozen-tbody' : 'rs-datatable-tbody'),
    rowGroupHeader: 'rs-datatable-row-group-header',
    rowToggleButton: 'rs-datatable-row-toggle-button',
    rowToggleIcon: 'rs-datatable-row-toggle-icon',
    row: ({ instance, props, index, columnSelectionMode }: StyleContext) => {
        let rowStyleClass = [];

        if (props.selectionMode) {
            rowStyleClass.push('rs-datatable-selectable-row');
        }

        if (props.selection) {
            rowStyleClass.push({
                'rs-datatable-row-selected': columnSelectionMode
                    ? instance.isSelected && instance.$parentInstance.$parentInstance.highlightOnSelect
                    : instance.isSelected
            });
        }

        if (props.contextMenuSelection) {
            rowStyleClass.push({
                'rs-datatable-contextmenu-row-selected': instance.isSelectedWithContextMenu
            });
        }

        rowStyleClass.push(index % 2 === 0 ? 'rs-row-even' : 'rs-row-odd');

        return rowStyleClass;
    },
    rowExpansion: 'rs-datatable-row-expansion',
    rowGroupFooter: 'rs-datatable-row-group-footer',
    emptyMessage: 'rs-datatable-empty-message',
    bodyCell: ({ instance }: StyleContext) => [
        {
            'rs-datatable-frozen-column': instance.columnProp('frozen')
        }
    ],
    reorderableRowHandle: 'rs-datatable-reorderable-row-handle',
    pcRowEditorInit: 'rs-datatable-row-editor-init',
    pcRowEditorSave: 'rs-datatable-row-editor-save',
    pcRowEditorCancel: 'rs-datatable-row-editor-cancel',
    tfoot: 'rs-datatable-tfoot',
    footerCell: ({ instance }: StyleContext) => [
        {
            'rs-datatable-frozen-column': instance.columnProp('frozen')
        }
    ],
    virtualScrollerSpacer: 'rs-datatable-virtualscroller-spacer',
    footer: 'rs-datatable-footer',
    columnResizeIndicator: 'rs-datatable-column-resize-indicator',
    rowReorderIndicatorUp: 'rs-datatable-row-reorder-indicator-up',
    rowReorderIndicatorDown: 'rs-datatable-row-reorder-indicator-down'
};

const inlineStyles = {
    tableContainer: { overflow: 'auto' },
    thead: { position: 'sticky' },
    tfoot: { position: 'sticky' }
};

export default BaseStyle.extend({
    name: 'datatable',
    style,
    classes,
    inlineStyles
});
