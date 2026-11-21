<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { TreeNode } from '../treenode/TreeNode';
import type { TreeTableFilterButtonPropsOptions, TreeTableFilterMeta, TreeTableSortMeta } from './TreeTable';
import type { TreeTableSelection } from './selection';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import TreeTableStyle from './style/TreeTableStyle';

export default defineComponent({
    name: 'BaseTreeTable',
    extends: BaseComponent,
    props: {
        value: {
            type: null as unknown as PropType<TreeNode[] | null>,
            default: null
        },
        dataKey: {
            type: [String, Function] as PropType<string | ((node: TreeNode) => string)>,
            default: 'key'
        },
        expandedKeys: {
            type: null as unknown as PropType<Record<string, boolean> | null>,
            default: null
        },
        selectionKeys: {
            type: null as unknown as PropType<TreeTableSelection>,
            default: null
        },
        selectionMode: {
            type: String,
            default: null
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
            type: Object as PropType<TreeNode>,
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
            type: String,
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
        loadingMode: {
            type: String,
            default: 'mask'
        },
        rowHover: {
            type: Boolean,
            default: false
        },
        autoLayout: {
            type: Boolean,
            default: false
        },
        sortField: {
            type: [String, Function] as PropType<string | ((data: TreeNode['data']) => string) | null>,
            default: null
        },
        sortOrder: {
            type: Number as PropType<number | null>,
            default: null
        },
        defaultSortOrder: {
            type: Number as PropType<NonNullable<TreeTableSortMeta['order']>>,
            default: 1
        },
        multiSortMeta: {
            type: Array as PropType<TreeTableSortMeta[] | null>,
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
            type: Object as PropType<TreeTableFilterMeta | null>,
            default: null
        },
        filterMode: {
            type: String,
            default: 'lenient'
        },
        filterLocale: {
            type: String,
            default: undefined
        },
        filterDisplay: {
            type: String,
            default: null
        },
        globalFilterFields: {
            type: Array as PropType<string[]>,
            default: null
        },
        filterInputProps: {
            type: null,
            default: null
        },
        filterButtonProps: {
            type: Object as PropType<Partial<TreeTableFilterButtonPropsOptions>>,
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
        resizableColumns: {
            type: Boolean,
            default: false
        },
        columnResizeMode: {
            type: String,
            default: 'fit'
        },
        indentation: {
            type: Number,
            default: 1
        },
        showGridlines: {
            type: Boolean,
            default: false
        },
        scrollable: {
            type: Boolean,
            default: false
        },
        scrollHeight: {
            type: String,
            default: null
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
        }
    },
    style: TreeTableStyle,
    provide() {
        return {
            $pcTreeTable: this,
            $parentInstance: this
        };
    }
});
</script>
