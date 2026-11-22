<script lang="ts">
import { defineComponent, type PropType, type StyleValue } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import DataTableStyle from './style/DataTableStyle';
import type { DataTableExportFunctionOptions, DataTableFilterMeta, DataTableSortMeta } from './DataTable';
import type { RowGroupFields } from './row-groups';

export type TableRow = Record<string, unknown>;
export type TableField = NonNullable<DataTableSortMeta['field']>;
export interface TableSortMeta {
    field: DataTableSortMeta['field'];
    order: number | null | undefined;
}

type TableVirtualScrollerOptions = Record<string, unknown> & {
    itemSize?: number;
    getItemSize?: (index: number) => number;
    lazy?: boolean;
};

export default defineComponent({
    name: 'BaseDataTable',
    extends: BaseComponent,
    props: {
        value: {
            type: Array as PropType<TableRow[]>,
            default: null
        },
        dataKey: {
            type: [String, Function] as PropType<TableField>,
            default: null
        },
        rows: {
            type: Number,
            default: 0
        },
        first: {
            type: Number,
            default: 0
        },
        totalRecords: {
            type: Number,
            default: 0
        },
        paginator: {
            type: Boolean,
            default: false
        },
        paginatorPosition: {
            type: String,
            default: 'bottom'
        },
        alwaysShowPaginator: {
            type: Boolean,
            default: true
        },
        paginatorTemplate: {
            type: [Object, String] as PropType<string | Record<string, string>>,
            default: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown'
        },
        pageLinkSize: {
            type: Number,
            default: 5
        },
        rowsPerPageOptions: {
            type: Array as PropType<number[]>,
            default: null
        },
        currentPageReportTemplate: {
            type: String,
            default: '({currentPage} of {totalPages})'
        },
        lazy: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        },
        loadingIcon: {
            type: String,
            default: undefined
        },
        sortField: {
            type: [String, Function] as PropType<TableField | null>,
            default: null
        },
        sortOrder: {
            type: Number as PropType<number | null>,
            default: null
        },
        defaultSortOrder: {
            type: Number,
            default: 1
        },
        nullSortOrder: {
            type: Number,
            default: 1
        },
        multiSortMeta: {
            type: Array as PropType<DataTableSortMeta[] | null>,
            default: null
        },
        sortMode: {
            type: String,
            default: 'single'
        },
        removableSort: {
            type: Boolean,
            default: false
        },
        filters: {
            type: Object as PropType<DataTableFilterMeta>,
            default: null
        },
        filterDisplay: {
            type: String,
            default: null
        },
        globalFilterFields: {
            type: Array as PropType<TableField[]>,
            default: null
        },
        filterLocale: {
            type: String,
            default: undefined
        },
        selection: {
            type: [Array, Object] as PropType<TableRow | TableRow[]>,
            default: null
        },
        selectionMode: {
            type: String,
            default: null
        },
        compareSelectionBy: {
            type: String,
            default: 'deepEquals'
        },
        metaKeySelection: {
            type: Boolean,
            default: false
        },
        contextMenu: {
            type: Boolean,
            default: false
        },
        contextMenuSelection: {
            type: Object,
            default: null
        },
        selectAll: {
            type: Boolean as PropType<boolean | null>,
            default: null
        },
        rowHover: {
            type: Boolean,
            default: false
        },
        csvSeparator: {
            type: String,
            default: ','
        },
        exportFilename: {
            type: String,
            default: 'download'
        },
        exportFunction: {
            type: Function as PropType<(options: DataTableExportFunctionOptions<unknown>) => string>,
            default: null
        },
        resizableColumns: {
            type: Boolean,
            default: false
        },
        columnResizeMode: {
            type: String,
            default: 'fit'
        },
        reorderableColumns: {
            type: Boolean,
            default: false
        },
        expandedRows: {
            type: [Array, Object] as PropType<TableRow[] | Record<string, boolean>>,
            default: null
        },
        expandedRowIcon: {
            type: String,
            default: undefined
        },
        collapsedRowIcon: {
            type: String,
            default: undefined
        },
        rowGroupMode: {
            type: String,
            default: null
        },
        groupRowsBy: {
            type: [Array, String, Function] as PropType<RowGroupFields>,
            default: null
        },
        expandableRowGroups: {
            type: Boolean,
            default: false
        },
        expandedRowGroups: {
            type: Array as PropType<unknown[]>,
            default: null
        },
        stateStorage: {
            type: String,
            default: 'session'
        },
        stateKey: {
            type: String,
            default: null
        },
        editMode: {
            type: String,
            default: null
        },
        editingRows: {
            type: Array as PropType<TableRow[]>,
            default: null
        },
        rowClass: {
            type: Function as PropType<(row: unknown) => unknown>,
            default: null
        },
        rowStyle: {
            type: Function as PropType<(row: unknown) => StyleValue>,
            default: null
        },
        scrollable: {
            type: Boolean,
            default: false
        },
        virtualScrollerOptions: {
            type: Object as PropType<TableVirtualScrollerOptions>,
            default: null
        },
        scrollHeight: {
            type: String,
            default: null
        },
        frozenValue: {
            type: Array as PropType<TableRow[]>,
            default: null
        },
        breakpoint: {
            type: String,
            default: '960px'
        },
        showHeaders: {
            type: Boolean,
            default: true
        },
        showGridlines: {
            type: Boolean,
            default: false
        },
        stripedRows: {
            type: Boolean,
            default: false
        },
        highlightOnSelect: {
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            default: null
        },
        tableStyle: {
            type: null,
            default: null
        },
        tableClass: {
            type: [String, Object],
            default: null
        },
        tableProps: {
            type: Object,
            default: null
        },
        filterInputProps: {
            type: null,
            default: null
        },
        filterButtonProps: {
            type: Object,
            default() {
                return {
                    filter: { severity: 'secondary', text: true, rounded: true },
                    inline: {
                        clear: { severity: 'secondary', text: true, rounded: true }
                    },
                    popover: {
                        addRule: { severity: 'info', text: true, size: 'small' },
                        removeRule: { severity: 'danger', text: true, size: 'small' },
                        apply: { size: 'small' },
                        clear: { outlined: true, size: 'small' }
                    }
                };
            }
        },
        editButtonProps: {
            type: Object,
            default() {
                return {
                    init: { severity: 'secondary', text: true, rounded: true },
                    save: { severity: 'secondary', text: true, rounded: true },
                    cancel: { severity: 'secondary', text: true, rounded: true }
                };
            }
        }
    },
    style: DataTableStyle,
    provide() {
        return {
            $pcDataTable: this,
            $parentInstance: this
        };
    }
});
</script>
