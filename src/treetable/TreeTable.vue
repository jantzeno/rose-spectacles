<template>
    <div :class="cx('root')" data-scrollselectors=".rs-treetable-scrollable-body" :data-p="dataP" v-bind="ptmi('root')">
        <slot></slot>
        <transition name="rs-overlay-mask">
            <div v-if="loading && loadingMode === 'mask'" :class="cx('loading')" v-bind="ptm('loading')">
                <div :class="cx('mask')" v-bind="ptm('mask')">
                    <slot name="loadingicon" :class="cx('loadingIcon')">
                        <component :is="loadingIcon ? 'span' : 'SpinnerIcon'" spin :class="[cx('loadingIcon'), loadingIcon]" v-bind="ptm('loadingIcon')" />
                    </slot>
                </div>
            </div>
        </transition>
        <div v-if="$slots.header" :class="cx('header')" v-bind="ptm('header')">
            <slot name="header"></slot>
        </div>
        <TTPaginator
            v-if="paginatorTop"
            :rows="d_rows"
            :first="d_first"
            :totalRecords="totalRecordsLength"
            :pageLinkSize="pageLinkSize"
            :template="paginatorTemplate"
            :rowsPerPageOptions="rowsPerPageOptions"
            :currentPageReportTemplate="currentPageReportTemplate"
            :class="cx('pcPaginator', { position: 'top' })"
            @page="onPage($event)"
            :alwaysShow="alwaysShowPaginator"
            :unstyled="unstyled"
            :pt="ptm('pcPaginator')"
        >
            <template v-if="$slots.paginatorcontainer" #container="slotProps">
                <slot
                    name="paginatorcontainer"
                    :first="slotProps.first"
                    :last="slotProps.last"
                    :rows="slotProps.rows"
                    :page="slotProps.page"
                    :pageCount="slotProps.pageCount"
                    :totalRecords="slotProps.totalRecords"
                    :firstPageCallback="slotProps.firstPageCallback"
                    :lastPageCallback="slotProps.lastPageCallback"
                    :prevPageCallback="slotProps.prevPageCallback"
                    :nextPageCallback="slotProps.nextPageCallback"
                    :rowChangeCallback="slotProps.rowChangeCallback"
                    :pageLinks="slotProps.pageLinks"
                    :changePageCallback="slotProps.changePageCallback"
                ></slot>
            </template>
            <template v-if="$slots.paginatorstart" #start>
                <slot name="paginatorstart"></slot>
            </template>
            <template v-if="$slots.paginatorend" #end>
                <slot name="paginatorend"></slot>
            </template>
            <template v-if="$slots.paginatorfirstpagelinkicon" #firstpagelinkicon="slotProps">
                <slot name="paginatorfirstpagelinkicon" :class="slotProps.class"></slot>
            </template>
            <template v-if="$slots.paginatorprevpagelinkicon" #prevpagelinkicon="slotProps">
                <slot name="paginatorprevpagelinkicon" :class="slotProps.class"></slot>
            </template>
            <template v-if="$slots.paginatornextpagelinkicon" #nextpagelinkicon="slotProps">
                <slot name="paginatornextpagelinkicon" :class="slotProps.class"></slot>
            </template>
            <template v-if="$slots.paginatorlastpagelinkicon" #lastpagelinkicon="slotProps">
                <slot name="paginatorlastpagelinkicon" :class="slotProps.class"></slot>
            </template>
            <template v-if="$slots.paginatorjumptopagedropdownicon" #jumptopagedropdownicon="slotProps">
                <slot name="paginatorjumptopagedropdownicon" :class="slotProps.class"></slot>
            </template>
            <template v-if="$slots.paginatorrowsperpagedropdownicon" #rowsperpagedropdownicon="slotProps">
                <slot name="paginatorrowsperpagedropdownicon" :class="slotProps.class"></slot>
            </template>
        </TTPaginator>
        <div :class="cx('tableContainer')" :style="[sx('tableContainer'), { maxHeight: scrollHeight }]" v-bind="ptm('tableContainer')">
            <table ref="table" role="treegrid" :class="[cx('table'), tableClass]" :style="tableStyle" v-bind="{ ...tableProps, ...ptm('table') }">
                <thead :class="cx('thead')" :style="sx('thead')" role="rowgroup" v-bind="ptm('thead')">
                    <tr role="row" v-bind="ptm('headerRow')">
                        <template v-for="(col, i) of columns" :key="columnProp(col, 'columnKey') || columnProp(col, 'field') || i">
                            <TTHeaderCell
                                v-if="!columnProp(col, 'hidden')"
                                :column="col"
                                :resizableColumns="resizableColumns"
                                :sortField="d_sortField ?? undefined"
                                :sortOrder="d_sortOrder"
                                :multiSortMeta="d_multiSortMeta"
                                :sortMode="sortMode"
                                :filters="d_filters"
                                :filtersStore="filters ?? undefined"
                                :filterDisplay="filterDisplay"
                                :filterInputProps="filterInputProps"
                                :filterButtonProps="headerFilterButtonProps"
                                @column-click="onColumnHeaderClick($event)"
                                @column-resizestart="onColumnResizeStart($event)"
                                @filter-change="onFilterChange"
                                @filter-apply="onFilterApply"
                                :index="i"
                                :unstyled="unstyled"
                                :pt="pt"
                            ></TTHeaderCell>
                        </template>
                    </tr>
                    <tr v-if="filterDisplay === 'row' || (!filterDisplay && hasColumnFilter())" v-bind="ptm('headerRow')">
                        <template v-for="(col, i) of columns" :key="columnProp(col, 'columnKey') || columnProp(col, 'field') || i">
                            <TTFilterHeaderCell
                                v-if="filterDisplay === 'row' && !columnProp(col, 'hidden')"
                                :column="col"
                                :index="i"
                                display="row"
                                :filters="d_filters"
                                :filtersStore="filters ?? undefined"
                                :filterInputProps="filterInputProps"
                                :filterButtonProps="headerFilterButtonProps"
                                @filter-change="onFilterChange"
                                @filter-apply="onFilterApply"
                                :unstyled="unstyled"
                                :pt="pt"
                            />
                            <th
                                v-else-if="!columnProp(col, 'hidden')"
                                :class="getFilterColumnHeaderClass(col)"
                                :style="[columnProp(col, 'style'), columnProp(col, 'filterHeaderStyle')]"
                                :data-p-frozen-column="columnProp(col, 'frozen')"
                                v-bind="ptm('headerCell', ptHeaderCellOptions(col))"
                            >
                                <component v-if="columnSlots(col).filter" :is="columnSlots(col).filter" :column="col" :index="i" />
                            </th>
                        </template>
                    </tr>
                </thead>
                <tbody :class="cx('tbody')" role="rowgroup" v-bind="ptm('tbody')">
                    <template v-if="!empty">
                        <TTRow
                            v-for="(node, index) of dataToRender"
                            :key="nodeKey(node)"
                            :dataKey="dataKey"
                            :columns="columns"
                            :node="node"
                            :level="0"
                            :expandedKeys="d_expandedKeys"
                            :indentation="indentation"
                            :selectionMode="selectionMode"
                            :selectionKeys="selectionKeys"
                            :ariaSetSize="dataToRender.length"
                            :ariaPosInset="index + 1"
                            :tabindex="setTabindex(node, index)"
                            :loadingMode="loadingMode"
                            :contextMenu="contextMenu"
                            :contextMenuSelection="contextMenuSelection"
                            :templates="$slots"
                            @node-toggle="onNodeToggle"
                            @node-click="onNodeClick"
                            @checkbox-change="onCheckboxChange"
                            @row-rightclick="onRowRightClick($event)"
                            :unstyled="unstyled"
                            :pt="pt"
                        ></TTRow>
                    </template>
                    <tr v-else :class="cx('emptyMessage')" v-bind="ptm('emptyMessage')">
                        <td :colspan="columns.length" v-bind="ptm('emptyMessageCell')">
                            <slot name="empty"></slot>
                        </td>
                    </tr>
                </tbody>
                <tfoot v-if="hasFooter" :class="cx('tfoot')" :style="sx('tfoot')" role="rowgroup" v-bind="ptm('tfoot')">
                    <tr role="row" v-bind="ptm('footerRow')">
                        <template v-for="(col, i) of columns" :key="columnProp(col, 'columnKey') || columnProp(col, 'field') || i">
                            <TTFooterCell v-if="!columnProp(col, 'hidden')" :column="col" :index="i" :unstyled="unstyled" :pt="pt"></TTFooterCell>
                        </template>
                    </tr>
                </tfoot>
            </table>
        </div>
        <TTPaginator
            v-if="paginatorBottom"
            :rows="d_rows"
            :first="d_first"
            :totalRecords="totalRecordsLength"
            :pageLinkSize="pageLinkSize"
            :template="paginatorTemplate"
            :rowsPerPageOptions="rowsPerPageOptions"
            :currentPageReportTemplate="currentPageReportTemplate"
            :class="cx('pcPaginator', { position: 'bottom' })"
            @page="onPage($event)"
            :alwaysShow="alwaysShowPaginator"
            :unstyled="unstyled"
            :pt="ptm('pcPaginator')"
        >
            <template v-if="$slots.paginatorcontainer" #container="slotProps">
                <slot
                    name="paginatorcontainer"
                    :first="slotProps.first"
                    :last="slotProps.last"
                    :rows="slotProps.rows"
                    :page="slotProps.page"
                    :pageCount="slotProps.pageCount"
                    :pageLinks="slotProps.pageLinks"
                    :totalRecords="slotProps.totalRecords"
                    :firstPageCallback="slotProps.firstPageCallback"
                    :lastPageCallback="slotProps.lastPageCallback"
                    :prevPageCallback="slotProps.prevPageCallback"
                    :nextPageCallback="slotProps.nextPageCallback"
                    :rowChangeCallback="slotProps.rowChangeCallback"
                    :changePageCallback="slotProps.changePageCallback"
                ></slot>
            </template>
            <template v-if="$slots.paginatorstart" #start>
                <slot name="paginatorstart"></slot>
            </template>
            <template v-if="$slots.paginatorend" #end>
                <slot name="paginatorend"></slot>
            </template>
            <template v-if="$slots.paginatorfirstpagelinkicon" #firstpagelinkicon="slotProps">
                <slot name="paginatorfirstpagelinkicon" :class="slotProps.class"></slot>
            </template>
            <template v-if="$slots.paginatorprevpagelinkicon" #prevpagelinkicon="slotProps">
                <slot name="paginatorprevpagelinkicon" :class="slotProps.class"></slot>
            </template>
            <template v-if="$slots.paginatornextpagelinkicon" #nextpagelinkicon="slotProps">
                <slot name="paginatornextpagelinkicon" :class="slotProps.class"></slot>
            </template>
            <template v-if="$slots.paginatorlastpagelinkicon" #lastpagelinkicon="slotProps">
                <slot name="paginatorlastpagelinkicon" :class="slotProps.class"></slot>
            </template>
            <template v-if="$slots.paginatorjumptopagedropdownicon" #jumptopagedropdownicon="slotProps">
                <slot name="paginatorjumptopagedropdownicon" :class="slotProps.class"></slot>
            </template>
            <template v-if="$slots.paginatorrowsperpagedropdownicon" #rowsperpagedropdownicon="slotProps">
                <slot name="paginatorrowsperpagedropdownicon" :class="slotProps.class"></slot>
            </template>
        </TTPaginator>
        <div v-if="$slots.footer" :class="cx('footer')" v-bind="ptm('footer')">
            <slot name="footer"></slot>
        </div>
        <div ref="resizeHelper" :class="cx('columnResizeIndicator')" style="display: none" v-bind="ptm('columnResizeIndicator')"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, type Slots, type VNode } from 'vue';
import { cn } from '../internal/utils/index';
import {
    addStyle,
    clearSelection,
    find,
    getAttribute,
    getIndex,
    getOffset,
    getOuterWidth,
    isClickable,
    isRTL,
    setAttribute
} from '../internal/utils/dom/index';
import { localeComparator, resolveFieldData, sort } from '../internal/utils/object/index';
import { FilterMatchMode, FilterOperator, FilterService } from '../core/api/Api';
import { getVNodeProp, HelperSet } from '../core/utils/Utils';
import { SpinnerIcon } from '../internal/lucide';
import Paginator from '../paginator/Paginator.vue';
import type { PageState } from '../paginator/Paginator';
import type { TreeNode } from '../treenode/TreeNode';
import BaseTreeTable from './BaseTreeTable.vue';
import FilterHeaderCell from './FilterHeaderCell.vue';
import FooterCell from './FooterCell.vue';
import HeaderCell from './HeaderCell.vue';
import TreeTableRow from './TreeTableRow.vue';

import type { TreeTableFilterMeta, TreeTableFilterMetaData, TreeTableOperatorFilterMetaData, TreeTableSortMeta } from './TreeTable';
import type { TreeTableCheckboxChange, TreeTableSelection } from './selection';

type FilterValue = TreeTableFilterMeta[string];
type FilterRule = (value: unknown, filter: unknown, locale?: string) => boolean;

interface NodeFilter {
    filterField: string;
    filterValue: unknown;
    filterConstraint: FilterRule;
    strict: boolean;
}

interface RowEvent {
    originalEvent: MouseEvent | KeyboardEvent;
    node: TreeNode;
}

interface NodeClick extends RowEvent {
    nodeTouched: boolean;
}

interface ColumnClick {
    originalEvent: MouseEvent | KeyboardEvent;
    column: VNode;
}

interface LazyLoadEvent {
    originalEvent?: MouseEvent | KeyboardEvent | PageState;
    first: number;
    rows: number;
    sortField: string | ((data: TreeNode['data']) => string) | null;
    sortOrder: number | null;
    multiSortMeta: TreeTableSortMeta[];
    filters: TreeTableFilterMeta | null;
    filterMatchModes?: Record<string, string>;
    page?: number;
    pageCount?: number;
    filteredValue?: TreeNode[];
}

export default defineComponent({
    name: 'TreeTable',
    extends: BaseTreeTable,
    inheritAttrs: false,
    emits: [
        'node-expand',
        'node-collapse',
        'update:expandedKeys',
        'update:selectionKeys',
        'node-select',
        'node-unselect',
        'update:first',
        'update:rows',
        'page',
        'update:sortField',
        'update:sortOrder',
        'update:multiSortMeta',
        'sort',
        'filter',
        'update:filters',
        'column-resize-end',
        'update:contextMenuSelection',
        'row-contextmenu'
    ],
    provide() {
        return {
            $columns: this.d_columns
        };
    },
    data() {
        return {
            d_expandedKeys: this.expandedKeys || {},
            d_first: this.first,
            d_rows: this.rows,
            d_sortField: this.sortField,
            d_sortOrder: this.sortOrder,
            d_multiSortMeta: this.multiSortMeta ? [...this.multiSortMeta] : [],
            d_filters: this.cloneFilters(this.filters),
            hasASelectedNode: false,
            d_columns: new HelperSet({ type: 'Column' }),
            documentColumnResizeListener: null as ((event: MouseEvent) => void) | null,
            documentColumnResizeEndListener: null as (() => void) | null,
            lastResizeHelperX: 0,
            resizeColumnElement: null as HTMLElement | null,
            columnResizing: false,
            styleElement: null as HTMLStyleElement | null
        };
    },
    watch: {
        expandedKeys(newValue: Record<string, boolean> | null) {
            this.d_expandedKeys = newValue ?? {};
        },
        first(newValue: number) {
            this.d_first = newValue;
        },
        rows(newValue: number) {
            this.d_rows = newValue;
        },
        sortField(newValue: LazyLoadEvent['sortField']) {
            this.d_sortField = newValue;
        },
        sortOrder(newValue: number | null) {
            this.d_sortOrder = newValue;
        },
        multiSortMeta(newValue: TreeTableSortMeta[] | null) {
            this.d_multiSortMeta = newValue ?? [];
        },
        filters: {
            deep: true,
            handler(newValue: TreeTableFilterMeta | null) {
                this.d_filters = this.cloneFilters(newValue);
            }
        }
    },
    beforeUnmount() {
        this.unbindColumnResizeEvents();
        this.destroyStyleElement();
        this.d_columns.clear();
    },
    methods: {
        columnSlots(col: VNode): Slots {
            return (col.children as Slots | null) ?? {};
        },
        columnProp(col: VNode, prop: string) {
            return getVNodeProp(col, prop);
        },
        ptHeaderCellOptions(column: VNode) {
            return {
                context: {
                    frozen: this.columnProp(column, 'frozen')
                }
            };
        },
        onNodeToggle(node: TreeNode) {
            const key = this.nodeKey(node);

            if (this.d_expandedKeys[key]) {
                delete this.d_expandedKeys[key];
                this.$emit('node-collapse', node);
            } else {
                this.d_expandedKeys[key] = true;
                this.$emit('node-expand', node);
            }

            this.d_expandedKeys = { ...this.d_expandedKeys };
            this.$emit('update:expandedKeys', this.d_expandedKeys);
        },
        onNodeClick(event: NodeClick) {
            if (this.rowSelectionMode && event.node.selectable !== false) {
                const metaSelection = event.nodeTouched ? false : this.metaKeySelection;
                const _selectionKeys = metaSelection ? this.handleSelectionWithMetaKey(event) : this.handleSelectionWithoutMetaKey(event);

                this.$emit('update:selectionKeys', _selectionKeys);
            }
        },
        nodeKey(node: TreeNode): string {
            return resolveFieldData(node, this.dataKey);
        },
        handleSelectionWithMetaKey(event: NodeClick) {
            const originalEvent = event.originalEvent;
            const node = event.node;
            const nodeKey = this.nodeKey(node);
            const metaKey = originalEvent.metaKey || originalEvent.ctrlKey;
            const selected = this.isNodeSelected(node);
            let _selectionKeys: TreeTableSelection = {};

            if (selected && metaKey) {
                if (this.isSingleSelectionMode()) {
                    _selectionKeys = {};
                } else {
                    _selectionKeys = { ...this.selectionKeys };
                    delete _selectionKeys[nodeKey];
                }

                this.$emit('node-unselect', node);
            } else {
                if (this.isSingleSelectionMode()) {
                    _selectionKeys = {};
                } else if (this.isMultipleSelectionMode()) {
                    _selectionKeys = !metaKey ? {} : this.selectionKeys ? { ...this.selectionKeys } : {};
                }

                _selectionKeys[nodeKey] = true;
                this.$emit('node-select', node);
            }

            return _selectionKeys;
        },
        handleSelectionWithoutMetaKey(event: NodeClick) {
            const node = event.node;
            const nodeKey = this.nodeKey(node);
            const selected = this.isNodeSelected(node);
            let _selectionKeys: TreeTableSelection = {};

            if (this.isSingleSelectionMode()) {
                if (selected) {
                    _selectionKeys = {};
                    this.$emit('node-unselect', node);
                } else {
                    _selectionKeys = {};
                    _selectionKeys[nodeKey] = true;
                    this.$emit('node-select', node);
                }
            } else {
                if (selected) {
                    _selectionKeys = { ...this.selectionKeys };
                    delete _selectionKeys[nodeKey];

                    this.$emit('node-unselect', node);
                } else {
                    _selectionKeys = this.selectionKeys ? { ...this.selectionKeys } : {};
                    _selectionKeys[nodeKey] = true;

                    this.$emit('node-select', node);
                }
            }

            return _selectionKeys;
        },
        onCheckboxChange(event: TreeTableCheckboxChange) {
            this.$emit('update:selectionKeys', event.selectionKeys);

            if (event.check) this.$emit('node-select', event.node);
            else this.$emit('node-unselect', event.node);
        },
        onRowRightClick(event: RowEvent) {
            if (this.contextMenu) {
                clearSelection();
                if (event.originalEvent.target instanceof HTMLElement) event.originalEvent.target.focus();
            }

            this.$emit('update:contextMenuSelection', event.node);
            this.$emit('row-contextmenu', event);
        },
        isSingleSelectionMode() {
            return this.selectionMode === 'single';
        },
        isMultipleSelectionMode() {
            return this.selectionMode === 'multiple';
        },
        onPage(event: PageState) {
            this.d_first = event.first;
            this.d_rows = event.rows;

            let pageEvent = this.createLazyLoadEvent(event);

            pageEvent.pageCount = event.pageCount;
            pageEvent.page = event.page;

            this.d_expandedKeys = {};
            this.$emit('update:expandedKeys', this.d_expandedKeys);
            this.$emit('update:first', this.d_first);
            this.$emit('update:rows', this.d_rows);
            this.$emit('page', pageEvent);
        },
        resetPage() {
            this.d_first = 0;
            this.$emit('update:first', this.d_first);
        },
        getFilterColumnHeaderClass(column: VNode) {
            return [this.cx('headerCell', { filterCell: true, frozen: !!this.columnProp(column, 'frozen') }), this.columnProp(column, 'filterHeaderClass')];
        },
        onColumnHeaderClick(e: ColumnClick) {
            let event = e.originalEvent;
            let column = e.column;

            if (this.columnProp(column, 'sortable')) {
                const targetNode = event.target;
                if (!(targetNode instanceof Element)) return;
                const columnField = this.columnProp(column, 'sortField') || this.columnProp(column, 'field');

                if (
                    getAttribute(targetNode, 'data-p-sortable-column') === true ||
                    getAttribute(targetNode, 'data-pc-section') === 'columntitle' ||
                    getAttribute(targetNode, 'data-pc-section') === 'columnheadercontent' ||
                    getAttribute(targetNode, 'data-pc-section') === 'sorticon' ||
                    (targetNode.parentElement && getAttribute(targetNode.parentElement, 'data-pc-section') === 'sorticon') ||
                    (targetNode.parentElement?.parentElement && getAttribute(targetNode.parentElement.parentElement, 'data-pc-section') === 'sorticon') ||
                    (targetNode.closest('[data-p-sortable-column="true"]') &&
                        !targetNode.closest('[data-pc-section="columnfilterbutton"]') &&
                        !isClickable(targetNode))
                ) {
                    clearSelection();

                    if (this.sortMode === 'single') {
                        if (this.d_sortField === columnField) {
                            if (this.removableSort && -Number(this.d_sortOrder) === this.defaultSortOrder) {
                                this.d_sortOrder = null;
                                this.d_sortField = null;
                            } else {
                                this.d_sortOrder = -Number(this.d_sortOrder);
                            }
                        } else {
                            this.d_sortOrder = this.defaultSortOrder;
                            this.d_sortField = columnField;
                        }

                        this.$emit('update:sortField', this.d_sortField);
                        this.$emit('update:sortOrder', this.d_sortOrder);
                        this.resetPage();
                    } else if (this.sortMode === 'multiple') {
                        let metaKey = event.metaKey || event.ctrlKey;

                        if (!metaKey) {
                            this.d_multiSortMeta = this.d_multiSortMeta.filter((meta) => meta.field === columnField);
                        }

                        this.addMultiSortField(columnField);
                        this.$emit('update:multiSortMeta', this.d_multiSortMeta);
                    }

                    this.$emit('sort', this.createLazyLoadEvent(event));
                }
            }
        },
        addMultiSortField(field: string) {
            let index = this.d_multiSortMeta.findIndex((meta) => meta.field === field);

            if (index >= 0) {
                if (this.removableSort && -Number(this.d_multiSortMeta[index].order) === this.defaultSortOrder) this.d_multiSortMeta.splice(index, 1);
                else this.d_multiSortMeta[index] = { field: field, order: -Number(this.d_multiSortMeta[index].order) as TreeTableSortMeta['order'] };
            } else {
                this.d_multiSortMeta.push({ field: field, order: this.defaultSortOrder });
            }

            this.d_multiSortMeta = [...this.d_multiSortMeta];
        },
        sortSingle(nodes: TreeNode[]) {
            return this.sortNodesSingle(nodes);
        },
        sortNodesSingle(nodes: TreeNode[]): TreeNode[] {
            const comparer = localeComparator();

            return [...nodes]
                .sort((node1, node2) => {
                    const value1 = resolveFieldData(node1.data, this.d_sortField);
                    const value2 = resolveFieldData(node2.data, this.d_sortField);

                    return sort(value1, value2, this.d_sortOrder ?? 0, comparer);
                })
                .map((node) => (node.children && node.children.length ? { ...node, children: this.sortNodesSingle(node.children) } : node));
        },
        sortMultiple(nodes: TreeNode[]) {
            return this.sortNodesMultiple(nodes);
        },
        sortNodesMultiple(nodes: TreeNode[]): TreeNode[] {
            return [...nodes]
                .sort((node1, node2) => {
                    return this.multisortField(node1, node2, 0);
                })
                .map((node) => (node.children && node.children.length ? { ...node, children: this.sortNodesMultiple(node.children) } : node));
        },
        multisortField(node1: TreeNode, node2: TreeNode, index: number): number {
            const value1 = resolveFieldData(node1.data, this.d_multiSortMeta[index].field);
            const value2 = resolveFieldData(node2.data, this.d_multiSortMeta[index].field);
            const comparer = localeComparator();

            if (value1 === value2) {
                return this.d_multiSortMeta.length - 1 > index ? this.multisortField(node1, node2, index + 1) : 0;
            }

            const order = this.d_multiSortMeta[index].order;

            return sort(value1, value2, order === null ? 0 : order, comparer);
        },
        filter(value: TreeNode[]) {
            const strict = this.filterMode === 'strict';
            const activeFilters = this.getActiveFilters(this.filters);
            const hasGlobalFilter = Object.prototype.hasOwnProperty.call(activeFilters, 'global');
            let filteredNodes = value;

            if (Object.keys(activeFilters).length > 0) {
                const globalFilterFields = hasGlobalFilter
                    ? this.globalFilterFields || this.columns.map((col) => this.columnProp(col, 'filterField') || this.columnProp(col, 'field'))
                    : [];

                filteredNodes = [];

                for (let node of value) {
                    let copyNode = { ...node };
                    let localMatch = true;
                    let globalMatch = false;

                    //local
                    for (let j = 0; j < this.columns.length; j++) {
                        let col = this.columns[j];
                        let filterField = this.columnProp(col, 'filterField') || this.columnProp(col, 'field');

                        if (Object.prototype.hasOwnProperty.call(activeFilters, filterField)) {
                            localMatch = this.isColumnFilterMatched(copyNode, col, filterField, activeFilters[filterField], strict);
                        }

                        if (!localMatch) {
                            break;
                        }
                    }

                    //global
                    if (localMatch && hasGlobalFilter) {
                        const globalFilterMeta = activeFilters['global'];
                        const meta = this.isFilterMetaObject(globalFilterMeta) ? (globalFilterMeta as TreeTableFilterMetaData) : null;
                        const filterValue = meta ? meta.value : globalFilterMeta;
                        const filterConstraint = this.resolveFilterConstraint(meta?.matchMode || FilterMatchMode.CONTAINS);

                        for (let filterField of globalFilterFields) {
                            let copyNodeForGlobal = { ...copyNode };

                            if (this.isNodeFilterMatched(copyNodeForGlobal, { filterField, filterValue, filterConstraint, strict })) {
                                globalMatch = true;
                                copyNode = copyNodeForGlobal;
                                break;
                            }
                        }
                    }

                    if (hasGlobalFilter ? localMatch && globalMatch : localMatch) {
                        filteredNodes.push(copyNode);
                    }
                }
            }

            let filterEvent = this.createLazyLoadEvent();

            filterEvent.filteredValue = filteredNodes;
            this.$emit('filter', filterEvent);

            return filteredNodes;
        },
        isFilterMetaObject(filterMeta: FilterValue): filterMeta is TreeTableFilterMetaData | TreeTableOperatorFilterMetaData {
            return filterMeta !== null && typeof filterMeta === 'object';
        },
        resolveFilterConstraint(matchMode: string | null | undefined): FilterRule {
            return FilterService.filters[matchMode || FilterMatchMode.STARTS_WITH];
        },
        isColumnFilterMatched(node: TreeNode, col: VNode, filterField: string, filterMeta: FilterValue, strict: boolean) {
            if (!this.isFilterMetaObject(filterMeta)) {
                // legacy flat value, the match mode comes from the column
                return this.isNodeFilterMatched(node, {
                    filterField,
                    filterValue: filterMeta,
                    filterConstraint: this.resolveFilterConstraint(this.columnProp(col, 'filterMatchMode')),
                    strict
                });
            }

            if ('operator' in filterMeta && filterMeta.operator) {
                const constraints = filterMeta.constraints;

                if (filterMeta.operator === FilterOperator.OR) {
                    // single pass with a combined predicate, keeps every branch matching any constraint
                    const filterConstraint: FilterRule = (dataFieldValue, _filterValue, filterLocale) =>
                        constraints.some((constraint) => this.resolveFilterConstraint(constraint.matchMode)(dataFieldValue, constraint.value, filterLocale));

                    return this.isNodeFilterMatched(node, { filterField, filterValue: null, filterConstraint, strict });
                }

                // each constraint prunes the subtree left by the previous one
                return constraints.every((constraint) =>
                    this.isNodeFilterMatched(node, {
                        filterField,
                        filterValue: constraint.value,
                        filterConstraint: this.resolveFilterConstraint(constraint.matchMode),
                        strict
                    })
                );
            }

            return this.isNodeFilterMatched(node, {
                filterField,
                filterValue: (filterMeta as TreeTableFilterMetaData).value,
                filterConstraint: this.resolveFilterConstraint((filterMeta as TreeTableFilterMetaData).matchMode || this.columnProp(col, 'filterMatchMode')),
                strict
            });
        },
        isNodeFilterMatched(node: TreeNode, paramsWithoutNode: NodeFilter) {
            // evaluation order matters, findFilteredNodes prunes the children of the node copy
            return paramsWithoutNode.strict
                ? !!(this.findFilteredNodes(node, paramsWithoutNode) || this.isFilterMatched(node, paramsWithoutNode))
                : !!(this.isFilterMatched(node, paramsWithoutNode) || this.findFilteredNodes(node, paramsWithoutNode));
        },
        getActiveFilters(filters: TreeTableFilterMeta | null): TreeTableFilterMeta {
            const removeEmptyFilters = ([key, value]: [string, FilterValue]): [string, FilterValue] | undefined => {
                if (!this.isFilterMetaObject(value)) {
                    return [key, value];
                }

                if ('constraints' in value && value.constraints) {
                    const filteredConstraints = value.constraints.filter((constraint) => constraint.value !== null);

                    if (filteredConstraints.length > 0) {
                        return [key, { ...value, constraints: filteredConstraints }];
                    }
                } else if ((value as TreeTableFilterMetaData).value !== null) {
                    return [key, value];
                }

                return undefined;
            };

            const entries = Object.entries(filters || {})
                .map(removeEmptyFilters)
                .filter((entry) => entry !== undefined);

            return Object.fromEntries(entries);
        },
        cloneFilters(filters: TreeTableFilterMeta | null): TreeTableFilterMeta {
            const cloned: TreeTableFilterMeta = {};

            if (filters) {
                Object.entries(filters).forEach(([prop, value]) => {
                    if (!this.isFilterMetaObject(value)) {
                        cloned[prop] = value;
                    } else if ('operator' in value && value.operator) {
                        cloned[prop] = {
                            operator: value.operator,
                            constraints: value.constraints.map((constraint) => {
                                return { ...constraint };
                            })
                        };
                    } else {
                        cloned[prop] = { ...value };
                    }
                });
            }

            return cloned;
        },
        onFilterChange(filters: TreeTableFilterMeta) {
            this.d_filters = filters;
        },
        onFilterApply() {
            this.d_first = 0;
            this.$emit('update:first', this.d_first);
            this.$emit('update:filters', this.d_filters);

            if (this.lazy) {
                const filterEvent = this.createLazyLoadEvent();

                filterEvent.filters = this.d_filters;
                this.$emit('filter', filterEvent);
            }
        },
        findFilteredNodes(node: TreeNode, paramsWithoutNode: NodeFilter): true | undefined {
            if (node) {
                let matched = false;

                if (node.children) {
                    let childNodes = [...node.children];

                    node.children = [];

                    for (let childNode of childNodes) {
                        let copyChildNode = { ...childNode };

                        if (this.isFilterMatched(copyChildNode, paramsWithoutNode)) {
                            matched = true;
                            node.children.push(copyChildNode);
                        }
                    }
                }

                if (matched) {
                    return true;
                }
            }
        },
        isFilterMatched(node: TreeNode, { filterField, filterValue, filterConstraint, strict }: NodeFilter): boolean {
            let matched = false;
            let dataFieldValue = resolveFieldData(node.data, filterField);

            if (filterConstraint(dataFieldValue, filterValue, this.filterLocale)) {
                matched = true;
            }

            if (!matched || (strict && !this.isNodeLeaf(node))) {
                matched = this.findFilteredNodes(node, { filterField, filterValue, filterConstraint, strict }) || matched;
            }

            return matched;
        },
        isNodeSelected(node: TreeNode) {
            return this.selectionMode && this.selectionKeys ? this.selectionKeys[this.nodeKey(node)] === true : false;
        },
        isNodeLeaf(node: TreeNode) {
            return node.leaf === false ? false : !(node.children && node.children.length);
        },
        createLazyLoadEvent(event?: LazyLoadEvent['originalEvent']): LazyLoadEvent {
            let filterMatchModes: Record<string, string> | undefined;

            if (this.hasFilters()) {
                filterMatchModes = {};
                for (const col of this.columns) {
                    const field = this.columnProp(col, 'field');

                    if (field) filterMatchModes[field] = this.columnProp(col, 'filterMatchMode');
                }
            }

            return {
                originalEvent: event,
                first: this.d_first,
                rows: this.d_rows,
                sortField: this.d_sortField,
                sortOrder: this.d_sortOrder,
                multiSortMeta: this.d_multiSortMeta,
                filters: this.filters,
                filterMatchModes: filterMatchModes
            };
        },
        onColumnResizeStart(event: MouseEvent) {
            let containerLeft = getOffset(this.$el).left;

            if (!(event.target instanceof Element) || !event.target.parentElement) return;

            this.resizeColumnElement = event.target.parentElement;
            this.columnResizing = true;
            this.lastResizeHelperX = event.pageX - containerLeft + this.$el.scrollLeft;

            this.bindColumnResizeEvents();
        },
        onColumnResize(event: MouseEvent) {
            const resizeHelper = this.$refs.resizeHelper as HTMLDivElement;
            let containerLeft = getOffset(this.$el).left;

            this.$el.setAttribute('data-p-unselectable-text', 'true');
            !this.isUnstyled && addStyle(this.$el, { 'user-select': 'none' });
            resizeHelper.style.height = this.$el.offsetHeight + 'px';
            resizeHelper.style.top = 0 + 'px';
            resizeHelper.style.left = event.pageX - containerLeft + this.$el.scrollLeft + 'px';

            resizeHelper.style.display = 'block';
        },
        onColumnResizeEnd() {
            const resizeHelper = this.$refs.resizeHelper as HTMLDivElement;
            const resizeColumnElement = this.resizeColumnElement;
            const table = this.$refs.table as HTMLTableElement;

            if (!resizeColumnElement) return;
            let delta = isRTL(this.$el) ? this.lastResizeHelperX - resizeHelper.offsetLeft : resizeHelper.offsetLeft - this.lastResizeHelperX;
            let columnWidth = resizeColumnElement.offsetWidth;
            let newColumnWidth = columnWidth + delta;
            let minWidth = resizeColumnElement.style.minWidth || 15;

            if (columnWidth + delta > parseInt(String(minWidth), 10)) {
                if (this.columnResizeMode === 'fit') {
                    let nextColumn = resizeColumnElement.nextElementSibling;
                    let nextColumnWidth = (nextColumn instanceof HTMLElement ? nextColumn.offsetWidth : 0) - delta;

                    if (newColumnWidth > 15 && nextColumnWidth > 15) {
                        this.resizeTableCells(newColumnWidth, nextColumnWidth);
                    }
                } else if (this.columnResizeMode === 'expand') {
                    const tableWidth = table.offsetWidth + delta + 'px';

                    const updateTableWidth = (el: HTMLTableElement) => {
                        !!el && (el.style.width = el.style.minWidth = tableWidth);
                    };

                    // Reasoning: resize table cells before updating the table width so that it can use existing computed cell widths and adjust only the one column.
                    this.resizeTableCells(newColumnWidth);
                    updateTableWidth(table);
                }

                this.$emit('column-resize-end', {
                    element: this.resizeColumnElement,
                    delta: delta
                });
            }

            resizeHelper.style.display = 'none';
            this.resizeColumnElement = null;
            this.$el.removeAttribute('data-p-unselectable-text');
            !this.isUnstyled && (this.$el.style['user-select'] = '');

            this.unbindColumnResizeEvents();
        },
        resizeTableCells(newColumnWidth: number, nextColumnWidth?: number) {
            if (!this.resizeColumnElement) return;

            const colIndex = getIndex(this.resizeColumnElement);
            const widths: number[] = [];
            let headers = find(this.$refs.table as HTMLTableElement, 'thead[data-pc-section="thead"] > tr > th');

            headers.forEach((header) => widths.push(getOuterWidth(header)));

            this.destroyStyleElement();
            this.createStyleElement();

            let innerHTML = '';
            let selector = `[data-pc-name="treetable"][${this.$attrSelector}] > [data-pc-section="tablecontainer"] > table[data-pc-section="table"]`;

            widths.forEach((width, index) => {
                let colWidth = index === colIndex ? newColumnWidth : nextColumnWidth && index === colIndex + 1 ? nextColumnWidth : width;
                let style = `width: ${colWidth}px !important; max-width: ${colWidth}px !important`;

                innerHTML += `
                    ${selector} > thead[data-pc-section="thead"] > tr > th:nth-child(${index + 1}),
                    ${selector} > tbody[data-pc-section="tbody"] > tr > td:nth-child(${index + 1}),
                    ${selector} > tfoot[data-pc-section="tfoot"] > tr > td:nth-child(${index + 1}) {
                        ${style}
                    }
                `;
            });

            if (this.styleElement) this.styleElement.innerHTML = innerHTML;
        },
        bindColumnResizeEvents() {
            if (!this.documentColumnResizeListener) {
                this.documentColumnResizeListener = (event) => {
                    if (this.columnResizing) {
                        this.onColumnResize(event);
                    }
                };
                document.addEventListener('mousemove', this.documentColumnResizeListener);
            }

            if (!this.documentColumnResizeEndListener) {
                this.documentColumnResizeEndListener = () => {
                    if (this.columnResizing) {
                        this.columnResizing = false;
                        this.onColumnResizeEnd();
                    }
                };
                document.addEventListener('mouseup', this.documentColumnResizeEndListener);
            }
        },
        unbindColumnResizeEvents() {
            if (this.documentColumnResizeListener) {
                document.removeEventListener('mousemove', this.documentColumnResizeListener);
                this.documentColumnResizeListener = null;
            }

            if (this.documentColumnResizeEndListener) {
                document.removeEventListener('mouseup', this.documentColumnResizeEndListener);
                this.documentColumnResizeEndListener = null;
            }
        },
        onColumnKeyDown(event: KeyboardEvent, col: VNode) {
            if (
                (event.code === 'Enter' || event.code === 'NumpadEnter') &&
                event.currentTarget instanceof HTMLTableCellElement &&
                getAttribute(event.currentTarget, 'data-p-sortable-column')
            ) {
                this.onColumnHeaderClick({ originalEvent: event, column: col });
            }
        },
        hasColumnFilter() {
            if (this.columns) {
                for (let col of this.columns) {
                    if (this.columnSlots(col).filter) {
                        return true;
                    }
                }
            }

            return false;
        },
        hasFilters() {
            return this.filters && Object.keys(this.filters).length > 0 && this.filters.constructor === Object;
        },
        hasGlobalFilter() {
            return this.filters && Object.prototype.hasOwnProperty.call(this.filters, 'global');
        },
        getItemLabel(node: TreeNode) {
            return node.data.name;
        },
        createStyleElement() {
            this.styleElement = document.createElement('style');
            this.styleElement.type = 'text/css';
            setAttribute(this.styleElement, 'nonce', this.$primevue?.config?.csp?.nonce);
            document.head.appendChild(this.styleElement);
        },
        destroyStyleElement() {
            if (this.styleElement) {
                document.head.removeChild(this.styleElement);
                this.styleElement = null;
            }
        },
        setTabindex(node: TreeNode, index: number) {
            if (this.isNodeSelected(node)) {
                this.hasASelectedNode = true;

                return 0;
            }

            if (this.selectionMode) {
                if (!this.isNodeSelected(node) && index === 0 && !this.hasASelectedNode) return 0;
            } else if (!this.selectionMode && index === 0) {
                return 0;
            }

            return -1;
        }
    },
    computed: {
        columns() {
            return this.d_columns.get(this) ?? [];
        },
        headerFilterButtonProps() {
            return {
                filter: { severity: 'secondary', text: true, rounded: true },
                ...this.filterButtonProps,
                inline: {
                    clear: { severity: 'secondary', text: true, rounded: true },
                    ...this.filterButtonProps.inline
                },
                popover: {
                    addRule: { severity: 'info', text: true, size: 'small' },
                    removeRule: { severity: 'danger', text: true, size: 'small' },
                    apply: { size: 'small' },
                    clear: { outlined: true, size: 'small' },
                    ...this.filterButtonProps.popover
                }
            };
        },
        processedData(): TreeNode[] | null {
            if (this.lazy) {
                return this.value;
            } else {
                if (this.value && this.value.length) {
                    let data = this.value;

                    if (this.sorted) {
                        if (this.sortMode === 'single') data = this.sortSingle(data);
                        else if (this.sortMode === 'multiple') data = this.sortMultiple(data);
                    }

                    if (this.hasFilters()) {
                        data = this.filter(data);
                    }

                    return data;
                } else {
                    return null;
                }
            }
        },
        dataToRender() {
            const data = this.processedData ?? [];

            if (this.paginator) {
                const first = this.lazy ? 0 : this.d_first;

                return data.slice(first, first + this.d_rows);
            } else {
                return data;
            }
        },
        empty() {
            const data = this.processedData;

            return !data || data.length === 0;
        },
        sorted() {
            return this.d_sortField || (this.d_multiSortMeta && this.d_multiSortMeta.length > 0);
        },
        hasFooter() {
            let hasFooter = false;

            for (let col of this.columns) {
                if (this.columnProp(col, 'footer') || this.columnSlots(col).footer) {
                    hasFooter = true;
                    break;
                }
            }

            return hasFooter;
        },
        paginatorTop() {
            return this.paginator && this.paginatorPosition !== 'bottom';
        },
        paginatorBottom() {
            return this.paginator && this.paginatorPosition !== 'top';
        },
        singleSelectionMode() {
            return this.selectionMode && this.selectionMode === 'single';
        },
        multipleSelectionMode() {
            return this.selectionMode && this.selectionMode === 'multiple';
        },
        rowSelectionMode() {
            return this.singleSelectionMode || this.multipleSelectionMode;
        },
        totalRecordsLength() {
            if (this.lazy) {
                return this.totalRecords;
            } else {
                const data = this.processedData;

                return data ? data.length : 0;
            }
        },
        dataP() {
            return cn({
                scrollable: this.scrollable,
                'flex-scrollable': this.scrollable && this.scrollHeight === 'flex',
                [this.size]: this.size,
                loading: this.loading,
                empty: this.empty
            });
        }
    },
    components: {
        TTRow: TreeTableRow,
        TTPaginator: Paginator,
        TTHeaderCell: HeaderCell,
        TTFilterHeaderCell: FilterHeaderCell,
        TTFooterCell: FooterCell,
        SpinnerIcon: SpinnerIcon
    }
});
</script>
