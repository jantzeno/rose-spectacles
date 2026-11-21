<template>
    <div :class="cx('root')" data-scrollselectors=".rs-datatable-wrapper" :data-p="dataP" v-bind="ptmi('root')">
        <slot></slot>
        <transition name="rs-overlay-mask">
            <div v-if="loading" :class="cx('mask')" v-bind="ptm('mask')">
                <slot v-if="$slots.loading" name="loading"></slot>
                <template v-else>
                    <component v-if="$slots.loadingicon" :is="$slots.loadingicon" :class="cx('loadingIcon')" />
                    <i v-else-if="loadingIcon" :class="[cx('loadingIcon'), 'pi-spin', loadingIcon]" v-bind="ptm('loadingIcon')" />
                    <SpinnerIcon v-else spin :class="cx('loadingIcon')" v-bind="ptm('loadingIcon')" />
                </template>
            </div>
        </transition>
        <div v-if="$slots.header" :class="cx('header')" v-bind="ptm('header')">
            <slot name="header"></slot>
        </div>
        <DTPaginator
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
            :data-p-top="true"
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
        </DTPaginator>
        <div
            :class="cx('tableContainer')"
            :style="[sx('tableContainer'), { maxHeight: virtualScrollerDisabled ? scrollHeight : '' }]"
            :data-p="dataP"
            v-bind="ptm('tableContainer')"
        >
            <DTVirtualScroller
                ref="virtualScroller"
                v-bind="virtualScrollerOptions"
                :items="processedData"
                :columns="columns"
                :style="scrollHeight !== 'flex' ? { height: scrollHeight } : undefined"
                :scrollHeight="scrollHeight !== 'flex' ? undefined : '100%'"
                :disabled="virtualScrollerDisabled"
                :getItemSize="getItemSize"
                loaderDisabled
                inline
                autoSize
                :showSpacer="false"
                :pt="ptm('virtualScroller')"
            >
                <template #content="slotProps">
                    <table
                        ref="table"
                        role="table"
                        :class="[cx('table'), tableClass]"
                        :style="[tableStyle, slotProps.spacerStyle]"
                        v-bind="{ ...tableProps, ...ptm('table') }"
                    >
                        <DTTableHeader
                            v-if="showHeaders"
                            :columnGroup="headerColumnGroup"
                            :columns="slotProps.columns"
                            :rowGroupMode="rowGroupMode"
                            :groupRowsBy="groupRowsBy"
                            :groupRowSortField="groupRowSortField ?? undefined"
                            :reorderableColumns="reorderableColumns"
                            :resizableColumns="resizableColumns"
                            :allRowsSelected="allRowsSelected"
                            :empty="empty"
                            :sortMode="sortMode"
                            :sortField="d_sortField ?? undefined"
                            :sortOrder="d_sortOrder ?? undefined"
                            :multiSortMeta="d_multiSortMeta"
                            :filters="d_filters"
                            :filtersStore="filters"
                            :filterDisplay="filterDisplay"
                            :filterButtonProps="headerFilterButtonProps"
                            :filterInputProps="filterInputProps"
                            :first="d_first"
                            @column-click="onColumnHeaderClick($event)"
                            @column-mousedown="onColumnHeaderMouseDown($event)"
                            @filter-change="onFilterChange"
                            @filter-apply="onFilterApply"
                            @column-dragstart="onColumnHeaderDragStart($event)"
                            @column-dragover="onColumnHeaderDragOver($event)"
                            @column-dragleave="onColumnHeaderDragLeave($event)"
                            @column-drop="onColumnHeaderDrop($event)"
                            @column-resizestart="onColumnResizeStart($event)"
                            @checkbox-change="toggleRowsWithCheckbox($event)"
                            :unstyled="unstyled"
                            :pt="pt"
                        />
                        <DTTableBody
                            v-if="frozenValue"
                            ref="frozenBodyRef"
                            :value="frozenValue"
                            :frozenRow="true"
                            :columns="slotProps.columns"
                            :first="d_first"
                            :dataKey="dataKey"
                            :selection="selection"
                            :selectionKeys="d_selectionKeys"
                            :selectionMode="selectionMode"
                            :rowHover="rowHover"
                            :contextMenu="contextMenu"
                            :contextMenuSelection="contextMenuSelection"
                            :rowGroupMode="rowGroupMode"
                            :groupRowsBy="groupRowsBy"
                            :expandableRowGroups="expandableRowGroups"
                            :rowClass="rowClass"
                            :rowStyle="rowStyle"
                            :editMode="editMode"
                            :compareSelectionBy="compareSelectionBy"
                            :scrollable="scrollable"
                            :expandedRowIcon="expandedRowIcon"
                            :collapsedRowIcon="collapsedRowIcon"
                            :expandedRows="expandedRows"
                            :expandedRowGroups="expandedRowGroups"
                            :editingRows="editingRows"
                            :editingRowKeys="d_editingRowKeys"
                            :templates="$slots"
                            :editButtonProps="rowEditButtonProps"
                            :isVirtualScrollerDisabled="true"
                            @rowgroup-toggle="toggleRowGroup"
                            @row-click="onRowClick($event)"
                            @row-dblclick="onRowDblClick($event)"
                            @row-rightclick="onRowRightClick($event)"
                            @row-touchend="onRowTouchEnd"
                            @row-keydown="onRowKeyDown"
                            @row-mousedown="onRowMouseDown"
                            @row-dragstart="onRowDragStart($event)"
                            @row-dragover="onRowDragOver($event)"
                            @row-dragleave="onRowDragLeave($event)"
                            @row-dragend="onRowDragEnd($event)"
                            @row-drop="onRowDrop($event)"
                            @row-toggle="toggleRow($event)"
                            @radio-change="toggleRowWithRadio($event)"
                            @checkbox-change="toggleRowWithCheckbox($event)"
                            @cell-edit-init="onCellEditInit($event)"
                            @cell-edit-complete="onCellEditComplete($event)"
                            @cell-edit-cancel="onCellEditCancel($event)"
                            @row-edit-init="onRowEditInit($event)"
                            @row-edit-save="onRowEditSave($event)"
                            @row-edit-cancel="onRowEditCancel($event)"
                            :editingMeta="d_editingMeta"
                            @editing-meta-change="onEditingMetaChange"
                            :unstyled="unstyled"
                            :pt="pt"
                        />
                        <DTTableBody
                            ref="bodyRef"
                            :value="dataToRender(slotProps.rows)"
                            :groupRowsValue="virtualScrollerDisabled ? undefined : processedData"
                            :class="slotProps.styleClass"
                            :columns="slotProps.columns"
                            :empty="empty"
                            :first="d_first"
                            :dataKey="dataKey"
                            :selection="selection"
                            :selectionKeys="d_selectionKeys"
                            :selectionMode="selectionMode"
                            :rowHover="rowHover"
                            :contextMenu="contextMenu"
                            :contextMenuSelection="contextMenuSelection"
                            :rowGroupMode="rowGroupMode"
                            :groupRowsBy="groupRowsBy"
                            :expandableRowGroups="expandableRowGroups"
                            :rowClass="rowClass"
                            :rowStyle="rowStyle"
                            :editMode="editMode"
                            :compareSelectionBy="compareSelectionBy"
                            :scrollable="scrollable"
                            :expandedRowIcon="expandedRowIcon"
                            :collapsedRowIcon="collapsedRowIcon"
                            :expandedRows="expandedRows"
                            :expandedRowGroups="expandedRowGroups"
                            :editingRows="editingRows"
                            :editingRowKeys="d_editingRowKeys"
                            :templates="$slots"
                            :editButtonProps="rowEditButtonProps"
                            :virtualScrollerContentProps="slotProps"
                            :isVirtualScrollerDisabled="virtualScrollerDisabled"
                            @rowgroup-toggle="toggleRowGroup"
                            @row-click="onRowClick($event)"
                            @row-dblclick="onRowDblClick($event)"
                            @row-rightclick="onRowRightClick($event)"
                            @row-touchend="onRowTouchEnd"
                            @row-keydown="onRowKeyDown($event, slotProps)"
                            @row-mousedown="onRowMouseDown"
                            @row-dragstart="onRowDragStart($event)"
                            @row-dragover="onRowDragOver($event)"
                            @row-dragleave="onRowDragLeave($event)"
                            @row-dragend="onRowDragEnd($event)"
                            @row-drop="onRowDrop($event)"
                            @row-toggle="toggleRow($event)"
                            @radio-change="toggleRowWithRadio($event)"
                            @checkbox-change="toggleRowWithCheckbox($event)"
                            @cell-edit-init="onCellEditInit($event)"
                            @cell-edit-complete="onCellEditComplete($event)"
                            @cell-edit-cancel="onCellEditCancel($event)"
                            @row-edit-init="onRowEditInit($event)"
                            @row-edit-save="onRowEditSave($event)"
                            @row-edit-cancel="onRowEditCancel($event)"
                            :editingMeta="d_editingMeta"
                            @editing-meta-change="onEditingMetaChange"
                            :unstyled="unstyled"
                            :pt="pt"
                        />
                        <tbody
                            v-if="hasSpacerStyle(slotProps.spacerStyle)"
                            :class="cx('virtualScrollerSpacer')"
                            :style="{ height: `calc(${slotProps.spacerStyle.height} - ${getRenderedWindowSize(slotProps)}px)` }"
                            v-bind="ptm('virtualScrollerSpacer')"
                        ></tbody>
                        <DTTableFooter :columnGroup="footerColumnGroup" :columns="slotProps.columns" :pt="pt" />
                    </table>
                </template>
            </DTVirtualScroller>
        </div>
        <DTPaginator
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
            :data-p-bottom="true"
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
        </DTPaginator>
        <div v-if="$slots.footer" :class="cx('footer')" v-bind="ptm('footer')">
            <slot name="footer"></slot>
        </div>
        <div ref="resizeHelper" :class="cx('columnResizeIndicator')" style="display: none" v-bind="ptm('columnResizeIndicator')"></div>
        <span
            v-if="reorderableColumns"
            ref="reorderIndicatorUp"
            :class="cx('rowReorderIndicatorUp')"
            style="position: absolute; display: none"
            v-bind="ptm('rowReorderIndicatorUp')"
        >
            <component :is="$slots.rowreorderindicatorupicon || $slots.reorderindicatorupicon || 'ArrowDownIcon'" />
        </span>
        <span
            v-if="reorderableColumns"
            ref="reorderIndicatorDown"
            :class="cx('rowReorderIndicatorDown')"
            style="position: absolute; display: none"
            v-bind="ptm('rowReorderIndicatorDown')"
        >
            <component :is="$slots.rowreorderindicatordownicon || $slots.reorderindicatordownicon || 'ArrowUpIcon'" />
        </span>
    </div>
</template>

<script lang="ts">
import { defineComponent, type VNode } from 'vue';
import { cn } from '../internal/utils/index';
import {
    addClass,
    addStyle,
    clearSelection,
    exportCSV,
    find,
    findSingle,
    focus,
    getAttribute,
    getHiddenElementOuterHeight,
    getHiddenElementOuterWidth,
    getIndex,
    getOffset,
    getOuterHeight,
    getOuterWidth,
    isClickable,
    isRTL,
    removeClass,
    setAttribute
} from '../internal/utils/dom/index';
import { equals, findIndexInList, isEmpty, isNotEmpty, localeComparator, reorderArray, resolveFieldData, sort } from '../internal/utils/object/index';
import { FilterMatchMode, FilterOperator, FilterService } from '../core/api/Api';
import { HelperSet, getVNodeProp } from '../core/utils/Utils';
import ArrowDownIcon from '../icons/arrowdown/ArrowDownIcon.vue';
import ArrowUpIcon from '../icons/arrowup/ArrowUpIcon.vue';
import SpinnerIcon from '../icons/spinner/SpinnerIcon.vue';
import Paginator from '../paginator/Paginator.vue';
import type { PageState } from '../paginator/Paginator';
import VirtualScroller from '../virtualscroller/VirtualScroller.vue';
import BaseDataTable, { type TableField, type TableRow, type TableSortMeta } from './BaseDataTable.vue';
import TableBody from './TableBody.vue';
import TableFooter from './TableFooter.vue';
import TableHeader from './TableHeader.vue';
import type {
    DataTableCellEditCancelEvent,
    DataTableCellEditCompleteEvent,
    DataTableCellEditInitEvent,
    DataTableExportCSVOptions,
    DataTableFilterMeta,
    DataTableFilterMetaData,
    DataTableOperatorFilterMetaData,
    DataTableRowEditInitEvent,
    DataTableSortMeta
} from './DataTable';

type ColumnKey = NonNullable<VNode['key']>;
type FilterValue = DataTableFilterMeta[string];
type KeyFlags = Record<string, number>;
type ColumnWidth = string | number | undefined;

interface ColumnEvent<T extends Event> {
    originalEvent: T;
    column: VNode;
}

interface RowEvent<T extends Event = Event> {
    originalEvent: T;
    index: number;
    data: TableRow;
}

interface RowDragEvent {
    originalEvent: DragEvent;
    index: number;
}

interface RenderWindow {
    rows?: TableRow[];
    itemSize?: number;
    getItemOptions?: (index: number) => { index: number };
}

interface LazyLoadEvent {
    originalEvent?: Event | PageState;
    first: number;
    rows: number;
    sortField: TableField | null;
    sortOrder: number | null;
    multiSortMeta: TableSortMeta[];
    filters: DataTableFilterMeta;
    page?: number;
    pageCount?: number;
    filteredValue?: TableRow[];
}

interface PersistedState {
    first?: number;
    rows?: number;
    sortField?: string;
    sortOrder?: number | null;
    multiSortMeta?: TableSortMeta[];
    filters?: DataTableFilterMeta;
    columnWidths?: string;
    columnWidthsByKey?: Record<string, string | number>;
    tableWidth?: string;
    columnOrder?: ColumnKey[] | null;
    expandedRows?: TableRow[] | Record<string, boolean>;
    expandedRowGroups?: unknown[];
    selection?: TableRow | TableRow[];
    selectionKeys?: KeyFlags | null;
}

export default defineComponent({
    name: 'DataTable',
    extends: BaseDataTable,
    inheritAttrs: false,
    emits: [
        'value-change',
        'update:first',
        'update:rows',
        'page',
        'update:sortField',
        'update:sortOrder',
        'update:multiSortMeta',
        'sort',
        'filter',
        'row-click',
        'row-dblclick',
        'update:selection',
        'row-select',
        'row-unselect',
        'update:contextMenuSelection',
        'row-contextmenu',
        'row-unselect-all',
        'row-select-all',
        'select-all-change',
        'column-resize-end',
        'column-reorder',
        'row-reorder',
        'update:expandedRows',
        'row-collapse',
        'row-expand',
        'update:expandedRowGroups',
        'rowgroup-collapse',
        'rowgroup-expand',
        'update:filters',
        'state-restore',
        'state-save',
        'cell-edit-init',
        'cell-edit-complete',
        'cell-edit-cancel',
        'update:editingRows',
        'row-edit-init',
        'row-edit-save',
        'row-edit-cancel',
        'update:totalRecords'
    ],
    provide() {
        return {
            $columns: this.d_columns,
            $columnGroups: this.d_columnGroups
        };
    },
    data() {
        return {
            d_first: this.first,
            d_rows: this.rows,
            d_sortField: this.sortField,
            d_sortOrder: this.sortOrder,
            d_nullSortOrder: this.nullSortOrder,
            d_multiSortMeta: (this.multiSortMeta ? [...this.multiSortMeta] : []) as TableSortMeta[],
            d_groupRowsSortMeta: null as TableSortMeta | null,
            d_selectionKeys: null as KeyFlags | null,
            d_columnOrder: null as ColumnKey[] | null,
            d_editingRowKeys: null as KeyFlags | null,
            d_editingMeta: {} as Record<number, { data: TableRow; fields: string[] }>,
            d_filters: this.cloneFilters(this.filters),
            d_columns: new HelperSet({ type: 'Column' }),
            d_columnGroups: new HelperSet({ type: 'ColumnGroup' }),
            d_rowGroupHeaderHeight: (this.virtualScrollerOptions && this.virtualScrollerOptions.itemSize) || 0,
            d_rowGroupFooterHeight: (this.virtualScrollerOptions && this.virtualScrollerOptions.itemSize) || 0,
            rowTouched: false,
            anchorRowIndex: null as number | null,
            rangeRowIndex: null as number | null,
            documentColumnResizeListener: null as ((event: MouseEvent) => void) | null,
            documentColumnResizeEndListener: null as (() => void) | null,
            lastResizeHelperX: 0,
            resizeColumnElement: null as HTMLElement | null,
            columnResizing: false,
            colReorderIconWidth: 0,
            colReorderIconHeight: 0,
            draggedColumn: null as VNode | null,
            draggedColumnElement: null as HTMLTableCellElement | null,
            dropPosition: null as number | null,
            draggedRowIndex: null as number | null,
            droppedRowIndex: null as number | null,
            rowDragging: false,
            columnWidthsState: null as string | null,
            columnWidthsByKeyState: null as PersistedState['columnWidthsByKey'] | null,
            columnWidthsByKey: null as Map<ColumnKey, number> | null,
            columnWidthsKeys: null as ColumnKey[] | null,
            tableWidthState: null as string | null,
            styleElement: null as HTMLStyleElement | null,
            lastSavedState: null as string | null
        };
    },
    watch: {
        first(newValue: number) {
            this.d_first = newValue;
        },
        rows(newValue: number) {
            this.d_rows = newValue;
        },
        sortField(newValue: TableField | null) {
            this.d_sortField = newValue;
        },
        sortOrder(newValue: number | null) {
            this.d_sortOrder = newValue;
        },
        nullSortOrder(newValue: number) {
            this.d_nullSortOrder = newValue;
        },
        multiSortMeta(newValue: DataTableSortMeta[] | null) {
            this.d_multiSortMeta = newValue ?? [];
        },
        selection: {
            immediate: true,
            handler(newValue: TableRow | TableRow[] | null) {
                if (this.dataKey) {
                    this.updateSelectionKeys(newValue);
                }
            }
        },
        editingRows: {
            immediate: true,
            handler(newValue: TableRow[] | null) {
                if (this.dataKey) {
                    this.updateEditingRowKeys(newValue);
                }
            }
        },
        filters: {
            deep: true,
            handler(newValue: DataTableFilterMeta | null) {
                this.d_filters = this.cloneFilters(newValue);
            }
        },
        totalRecordsLength(newValue: number) {
            this.$emit('update:totalRecords', newValue);
        }
    },
    mounted() {
        if (this.isStateful()) {
            this.restoreState();

            this.resizableColumns && this.restoreColumnWidths();
        }

        if (this.editMode === 'row' && this.dataKey && !this.d_editingRowKeys) {
            this.updateEditingRowKeys(this.editingRows);
        }

        this.updateRowGroupHeights();
    },
    beforeUnmount() {
        this.unbindColumnResizeEvents();
        this.destroyStyleElement();

        this.d_columns.clear();
        this.d_columnGroups.clear();
    },
    updated() {
        this.restoreColumnWidthsByKey();

        if (this.isStateful()) {
            this.saveState();
        }

        if (this.editMode === 'row' && this.dataKey && !this.d_editingRowKeys) {
            this.updateEditingRowKeys(this.editingRows);
        }

        this.updateRowGroupHeights();
    },
    methods: {
        columnProp(col: VNode | null, prop: string) {
            return getVNodeProp(col, prop);
        },
        onPage(event: PageState) {
            this.clearEditingMetaData();

            this.d_first = event.first;
            this.d_rows = event.rows;

            let pageEvent = this.createLazyLoadEvent(event);

            pageEvent.pageCount = event.pageCount;
            pageEvent.page = event.page;

            this.$emit('update:first', this.d_first);
            this.$emit('update:rows', this.d_rows);
            this.$emit('page', pageEvent);
            this.$nextTick(() => {
                this.$emit('value-change', this.processedData);
            });
        },
        onColumnHeaderClick(e: ColumnEvent<MouseEvent | KeyboardEvent>) {
            const event = e.originalEvent;
            const column = e.column;

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
                    this.$nextTick(() => {
                        this.$emit('value-change', this.processedData);
                    });
                }
            }
        },
        sortSingle(value: TableRow[]): TableRow[] {
            this.clearEditingMetaData();

            if (this.groupRowsBy && this.groupRowsBy === this.sortField) {
                this.d_multiSortMeta = [
                    { field: this.sortField, order: this.sortOrder || this.defaultSortOrder },
                    { field: this.d_sortField ?? undefined, order: this.d_sortOrder }
                ];

                return this.sortMultiple(value);
            }

            let data = [...value];
            let resolvedFieldData = new Map();

            for (let item of data) {
                resolvedFieldData.set(item, resolveFieldData(item, this.d_sortField));
            }

            const comparer = localeComparator();

            data.sort((data1, data2) => {
                let value1 = resolvedFieldData.get(data1);
                let value2 = resolvedFieldData.get(data2);

                return sort(value1, value2, this.d_sortOrder === null ? 0 : this.d_sortOrder, comparer, this.d_nullSortOrder);
            });

            return data;
        },
        sortMultiple(value: TableRow[]): TableRow[] {
            this.clearEditingMetaData();

            if (this.groupRowsBy && (this.d_groupRowsSortMeta || (this.d_multiSortMeta.length && this.groupRowsBy === this.d_multiSortMeta[0].field))) {
                const firstSortMeta = this.d_multiSortMeta[0];

                !this.d_groupRowsSortMeta && (this.d_groupRowsSortMeta = firstSortMeta);

                if (this.d_groupRowsSortMeta && firstSortMeta?.field !== this.d_groupRowsSortMeta.field) {
                    this.d_multiSortMeta = [this.d_groupRowsSortMeta, ...this.d_multiSortMeta];
                }
            }

            let data = [...value];

            data.sort((data1, data2) => {
                return this.multisortField(data1, data2, 0);
            });

            return data;
        },
        multisortField(data1: TableRow, data2: TableRow, index: number): number {
            const value1 = resolveFieldData(data1, this.d_multiSortMeta[index].field);
            const value2 = resolveFieldData(data2, this.d_multiSortMeta[index].field);
            const comparer = localeComparator();

            if (value1 === value2) {
                return this.d_multiSortMeta.length - 1 > index ? this.multisortField(data1, data2, index + 1) : 0;
            }

            const order = this.d_multiSortMeta[index].order;

            return sort(value1, value2, order === null ? 0 : order, comparer, this.d_nullSortOrder);
        },
        addMultiSortField(field: DataTableSortMeta['field']) {
            let index = this.d_multiSortMeta.findIndex((meta) => meta.field === field);

            if (index >= 0) {
                if (this.removableSort && -Number(this.d_multiSortMeta[index].order) === this.defaultSortOrder) this.d_multiSortMeta.splice(index, 1);
                else this.d_multiSortMeta[index] = { field: field, order: -Number(this.d_multiSortMeta[index].order) };
            } else {
                this.d_multiSortMeta.push({ field: field, order: this.defaultSortOrder });
            }

            this.d_multiSortMeta = [...this.d_multiSortMeta];
        },
        getActiveFilters(filters: DataTableFilterMeta): DataTableFilterMeta {
            const removeEmptyFilters = ([key, value]: [string, FilterValue]): [string, FilterValue] | undefined => {
                if (typeof value === 'object' && value !== null && 'constraints' in value) {
                    const filteredConstraints = value.constraints.filter((constraint) => constraint.value !== null);

                    if (filteredConstraints.length > 0) {
                        return [key, { ...value, constraints: filteredConstraints }];
                    }
                } else if ((value as DataTableFilterMetaData).value !== null) {
                    return [key, value];
                }

                return undefined;
            };

            const entries = Object.entries(filters)
                .map(removeEmptyFilters)
                .filter((entry) => entry !== undefined);

            return Object.fromEntries(entries);
        },
        filter(data: TableRow[]): TableRow[] {
            if (!data) return [];

            this.clearEditingMetaData();

            const activeFilters = this.getActiveFilters(this.filters);
            const globalFilter = activeFilters.global as DataTableFilterMetaData | undefined;
            let globalFilterFieldsArray: TableField[] | undefined;

            if (activeFilters['global']) {
                globalFilterFieldsArray =
                    this.globalFilterFields || this.columns.map((col) => this.columnProp(col, 'filterField') || this.columnProp(col, 'field'));
            }

            let filteredValue = [];

            for (let i = 0; i < data.length; i++) {
                let localMatch = true;
                let globalMatch = false;
                let localFiltered = false;

                for (let prop in activeFilters) {
                    if (Object.prototype.hasOwnProperty.call(activeFilters, prop) && prop !== 'global') {
                        localFiltered = true;
                        let filterField = prop;
                        let filterMeta = activeFilters[filterField];

                        if (typeof filterMeta === 'object' && filterMeta !== null && 'operator' in filterMeta && filterMeta.operator) {
                            for (let filterConstraint of filterMeta.constraints) {
                                localMatch = this.executeLocalFilter(filterField, data[i], filterConstraint);

                                if ((filterMeta.operator === FilterOperator.OR && localMatch) || (filterMeta.operator === FilterOperator.AND && !localMatch)) {
                                    break;
                                }
                            }
                        } else {
                            localMatch = this.executeLocalFilter(filterField, data[i], filterMeta);
                        }

                        if (!localMatch) {
                            break;
                        }
                    }
                }

                if (localMatch && activeFilters['global'] && !globalMatch && globalFilterFieldsArray) {
                    for (let j = 0; j < globalFilterFieldsArray.length; j++) {
                        let globalFilterField = globalFilterFieldsArray[j];

                        globalMatch = FilterService.filters[globalFilter?.matchMode || FilterMatchMode.CONTAINS](
                            resolveFieldData(data[i], globalFilterField),
                            globalFilter?.value,
                            this.filterLocale
                        );

                        if (globalMatch) {
                            break;
                        }
                    }
                }

                let matches;

                if (activeFilters['global']) {
                    matches = localFiltered ? localFiltered && localMatch && globalMatch : globalMatch;
                } else {
                    matches = localFiltered && localMatch;
                }

                if (matches) {
                    filteredValue.push(data[i]);
                }
            }

            if (filteredValue.length === this.value.length || Object.keys(activeFilters).length == 0) {
                filteredValue = data;
            }

            let filterEvent = this.createLazyLoadEvent();

            filterEvent.filteredValue = filteredValue;
            this.$emit('filter', filterEvent);
            this.$emit('value-change', filteredValue);

            return filteredValue;
        },
        executeLocalFilter(field: string, rowData: TableRow, filterMeta: FilterValue) {
            const { value: filterValue, matchMode } = filterMeta as DataTableFilterMetaData;
            const filterMatchMode = matchMode || FilterMatchMode.STARTS_WITH;
            let dataFieldValue = resolveFieldData(rowData, field);
            let filterConstraint = FilterService.filters[filterMatchMode];

            return filterConstraint(dataFieldValue, filterValue, this.filterLocale);
        },
        onRowClick(e: RowEvent<MouseEvent | KeyboardEvent>) {
            const event = e.originalEvent;
            const body = (this.$refs.bodyRef as { $el: HTMLTableSectionElement } | undefined)?.$el;
            const focusedItem = findSingle(body, 'tr[data-p-selectable-row="true"][tabindex="0"]');

            if (event.target instanceof Element && isClickable(event.target)) {
                return;
            }

            this.$emit('row-click', e);

            if (this.selectionMode) {
                const rowData = e.data;
                const rowIndex = this.d_first + e.index;

                if (this.isMultipleSelectionMode() && event.shiftKey && this.anchorRowIndex != null) {
                    clearSelection();
                    this.rangeRowIndex = rowIndex;
                    this.selectRange(event);
                } else {
                    const selected = this.isSelected(rowData);
                    const metaSelection = this.rowTouched ? false : this.metaKeySelection;

                    this.anchorRowIndex = rowIndex;
                    this.rangeRowIndex = rowIndex;

                    if (metaSelection) {
                        let metaKey = event.metaKey || event.ctrlKey;

                        if (selected && metaKey) {
                            if (this.isSingleSelectionMode()) {
                                this.$emit('update:selection', null);
                            } else {
                                const selectionIndex = this.findIndexInSelection(rowData);
                                const _selection = this.selectionArray.filter((_, i) => i !== selectionIndex);

                                this.$emit('update:selection', _selection);
                            }

                            this.$emit('row-unselect', { originalEvent: event, data: rowData, index: rowIndex, type: 'row' });
                        } else {
                            if (this.isSingleSelectionMode()) {
                                this.$emit('update:selection', rowData);
                            } else if (this.isMultipleSelectionMode()) {
                                let _selection = metaKey ? this.selectionArray : [];

                                _selection = [..._selection, rowData];
                                this.$emit('update:selection', _selection);
                            }

                            this.$emit('row-select', { originalEvent: event, data: rowData, index: rowIndex, type: 'row' });
                        }
                    } else {
                        if (this.selectionMode === 'single') {
                            if (selected) {
                                this.$emit('update:selection', null);
                                this.$emit('row-unselect', { originalEvent: event, data: rowData, index: rowIndex, type: 'row' });
                            } else {
                                this.$emit('update:selection', rowData);
                                this.$emit('row-select', { originalEvent: event, data: rowData, index: rowIndex, type: 'row' });
                            }
                        } else if (this.selectionMode === 'multiple') {
                            if (selected) {
                                const selectionIndex = this.findIndexInSelection(rowData);
                                const _selection = this.selectionArray.filter((_, i) => i !== selectionIndex);

                                this.$emit('update:selection', _selection);
                                this.$emit('row-unselect', { originalEvent: event, data: rowData, index: rowIndex, type: 'row' });
                            } else {
                                const _selection = [...this.selectionArray, rowData];

                                this.$emit('update:selection', _selection);
                                this.$emit('row-select', { originalEvent: event, data: rowData, index: rowIndex, type: 'row' });
                            }
                        }
                    }
                }
            }

            this.rowTouched = false;

            if (focusedItem) {
                if (event.target instanceof Element && event.target.getAttribute('data-pc-section') === 'rowtoggleicon') return;

                const targetRow =
                    event.currentTarget instanceof Element ? event.currentTarget.closest<HTMLTableRowElement>('tr[data-p-selectable-row="true"]') : null;

                if (focusedItem instanceof HTMLElement) focusedItem.tabIndex = -1;
                if (targetRow) targetRow.tabIndex = 0;
            }
        },
        onRowDblClick(e: RowEvent<MouseEvent>) {
            const event = e.originalEvent;

            if (event.target instanceof Element && isClickable(event.target)) {
                return;
            }

            this.$emit('row-dblclick', e);
        },
        onRowRightClick(event: RowEvent<MouseEvent>) {
            if (this.contextMenu) {
                clearSelection();
                if (event.originalEvent.target instanceof HTMLElement) focus(event.originalEvent.target);
            }

            this.$emit('update:contextMenuSelection', event.data);
            this.$emit('row-contextmenu', event);
        },
        onRowTouchEnd() {
            this.rowTouched = true;
        },
        onRowKeyDown(e: RowEvent<KeyboardEvent>, slotProps: RenderWindow = {}) {
            const event = e.originalEvent;
            const rowData = e.data;
            const rowIndex = e.index;
            const metaKey = event.metaKey || event.ctrlKey;

            if (this.selectionMode) {
                const row = event.target;

                if (!(row instanceof HTMLElement)) return;

                switch (event.code) {
                    case 'ArrowDown':
                        this.onArrowDownKey(event, row, rowIndex, slotProps);
                        break;

                    case 'ArrowUp':
                        this.onArrowUpKey(event, row, rowIndex, slotProps);
                        break;

                    case 'Home':
                        this.onHomeKey(event, row, rowIndex, slotProps);
                        break;

                    case 'End':
                        this.onEndKey(event, row, rowIndex, slotProps);
                        break;

                    case 'Enter':
                    case 'NumpadEnter':
                        this.onEnterKey(event, rowData, rowIndex);
                        break;

                    case 'Space':
                        this.onSpaceKey(event, rowData, rowIndex, slotProps);
                        break;

                    case 'Tab':
                        this.onTabKey(event, rowIndex);
                        break;

                    default:
                        if (event.code === 'KeyA' && metaKey && this.isMultipleSelectionMode()) {
                            const data = this.dataToRender(slotProps.rows);

                            this.$emit('update:selection', data);
                        }

                        const isCopyShortcut = event.code === 'KeyC' && metaKey;

                        if (!isCopyShortcut) event.preventDefault();

                        break;
                }
            }
        },
        onArrowDownKey(event: KeyboardEvent, row: HTMLElement, rowIndex: number, slotProps: RenderWindow) {
            const nextRow = this.findNextSelectableRow(row);

            nextRow && this.focusRowChange(row, nextRow);

            if (event.shiftKey) {
                const data = this.dataToRender(slotProps.rows);
                const nextRowIndex = rowIndex + 1 >= data.length ? data.length - 1 : rowIndex + 1;

                this.onRowClick({ originalEvent: event, data: data[nextRowIndex], index: nextRowIndex });
            }

            event.preventDefault();
        },
        onArrowUpKey(event: KeyboardEvent, row: HTMLElement, rowIndex: number, slotProps: RenderWindow) {
            const prevRow = this.findPrevSelectableRow(row);

            prevRow && this.focusRowChange(row, prevRow);

            if (event.shiftKey) {
                const data = this.dataToRender(slotProps.rows);
                const prevRowIndex = rowIndex - 1 <= 0 ? 0 : rowIndex - 1;

                this.onRowClick({ originalEvent: event, data: data[prevRowIndex], index: prevRowIndex });
            }

            event.preventDefault();
        },
        onHomeKey(event: KeyboardEvent, row: HTMLElement, rowIndex: number, slotProps: RenderWindow) {
            const firstRow = this.findFirstSelectableRow();

            firstRow && this.focusRowChange(row, firstRow);

            if (event.ctrlKey && event.shiftKey) {
                const data = this.dataToRender(slotProps.rows);

                this.$emit('update:selection', data.slice(0, rowIndex + 1));
            }

            event.preventDefault();
        },
        onEndKey(event: KeyboardEvent, row: HTMLElement, rowIndex: number, slotProps: RenderWindow) {
            const lastRow = this.findLastSelectableRow();

            lastRow && this.focusRowChange(row, lastRow);

            if (event.ctrlKey && event.shiftKey) {
                const data = this.dataToRender(slotProps.rows);

                this.$emit('update:selection', data.slice(rowIndex, data.length));
            }

            event.preventDefault();
        },
        onEnterKey(event: KeyboardEvent, rowData: TableRow, rowIndex: number) {
            this.onRowClick({ originalEvent: event, data: rowData, index: rowIndex });
            event.preventDefault();
        },
        onSpaceKey(event: KeyboardEvent, rowData: TableRow, rowIndex: number, slotProps: RenderWindow) {
            this.onEnterKey(event, rowData, rowIndex);

            if (event.shiftKey && this.selection !== null) {
                const data = this.dataToRender(slotProps.rows);
                let index;

                if (this.selectionArray.length > 0) {
                    let firstSelectedRowIndex, lastSelectedRowIndex;

                    firstSelectedRowIndex = findIndexInList(this.selectionArray[0], data);
                    lastSelectedRowIndex = findIndexInList(this.selectionArray[this.selectionArray.length - 1], data);

                    index = rowIndex <= firstSelectedRowIndex ? lastSelectedRowIndex : firstSelectedRowIndex;
                } else {
                    index = findIndexInList(this.selection, data);
                }

                const _selection = index !== rowIndex ? data.slice(Math.min(index, rowIndex), Math.max(index, rowIndex) + 1) : rowData;

                this.$emit('update:selection', _selection);
            }
        },
        onTabKey(event: KeyboardEvent, rowIndex: number) {
            const body = (this.$refs.bodyRef as { $el: HTMLTableSectionElement } | undefined)?.$el;
            const rows = body?.querySelectorAll<HTMLTableRowElement>('tr[data-p-selectable-row="true"]');

            if (event.code === 'Tab' && rows && rows.length > 0) {
                const firstSelectedRow = findSingle(body, 'tr[data-p-selected="true"]');
                const focusedItem = findSingle(body, 'tr[data-p-selectable-row="true"][tabindex="0"]');

                if (firstSelectedRow instanceof HTMLElement) {
                    firstSelectedRow.tabIndex = 0;
                    if (focusedItem instanceof HTMLElement && focusedItem !== firstSelectedRow) focusedItem.tabIndex = -1;
                } else {
                    rows[0].tabIndex = 0;
                    if (focusedItem !== rows[0] && rows[rowIndex]) rows[rowIndex].tabIndex = -1;
                }
            }
        },
        findNextSelectableRow(row: Element): Element | null {
            let nextRow = row.nextElementSibling;

            if (nextRow) {
                if (getAttribute(nextRow, 'data-p-selectable-row') === true) return nextRow;
                else return this.findNextSelectableRow(nextRow);
            } else {
                return null;
            }
        },
        findPrevSelectableRow(row: Element): Element | null {
            let prevRow = row.previousElementSibling;

            if (prevRow) {
                if (getAttribute(prevRow, 'data-p-selectable-row') === true) return prevRow;
                else return this.findPrevSelectableRow(prevRow);
            } else {
                return null;
            }
        },
        findFirstSelectableRow() {
            const firstRow = findSingle(this.$refs.table as HTMLTableElement | undefined, 'tr[data-p-selectable-row="true"]');

            return firstRow;
        },
        findLastSelectableRow() {
            const rows = (this.$refs.table as HTMLTableElement | undefined)?.querySelectorAll('tr[data-p-selectable-row="true"]');

            return rows ? rows[rows.length - 1] : null;
        },
        focusRowChange(firstFocusableRow: HTMLElement, currentFocusedRow: Element) {
            if (!(currentFocusedRow instanceof HTMLElement)) return;

            firstFocusableRow.tabIndex = -1;
            currentFocusedRow.tabIndex = 0;
            focus(currentFocusedRow);
        },
        toggleRowWithRadio(event: RowEvent) {
            const rowData = event.data;

            if (this.isSelected(rowData)) {
                this.$emit('update:selection', null);
                this.$emit('row-unselect', { originalEvent: event.originalEvent, data: rowData, index: event.index, type: 'radiobutton' });
            } else {
                this.$emit('update:selection', rowData);
                this.$emit('row-select', { originalEvent: event.originalEvent, data: rowData, index: event.index, type: 'radiobutton' });
            }
        },
        toggleRowWithCheckbox(event: RowEvent) {
            const rowData = event.data;

            if (this.isSelected(rowData)) {
                const selectionIndex = this.findIndexInSelection(rowData);
                const _selection = this.selectionArray.filter((_, i) => i !== selectionIndex);

                this.$emit('update:selection', _selection);
                this.$emit('row-unselect', { originalEvent: event.originalEvent, data: rowData, index: event.index, type: 'checkbox' });
            } else {
                let _selection = [...this.selectionArray];

                _selection = [..._selection, rowData];
                this.$emit('update:selection', _selection);
                this.$emit('row-select', { originalEvent: event.originalEvent, data: rowData, index: event.index, type: 'checkbox' });
            }
        },
        toggleRowsWithCheckbox(event: { originalEvent: Event; checked: boolean }) {
            if (this.selectAll !== null) {
                this.$emit('select-all-change', event);
            } else {
                const { originalEvent, checked } = event;
                let _selection: TableRow[] = [];

                if (checked) {
                    _selection = this.frozenValue ? [...this.frozenValue, ...this.processedData] : this.processedData;
                    this.$emit('row-select-all', { originalEvent, data: _selection });
                } else {
                    this.$emit('row-unselect-all', { originalEvent });
                }

                this.$emit('update:selection', _selection);
            }
        },
        isSingleSelectionMode() {
            return this.selectionMode === 'single';
        },
        isMultipleSelectionMode() {
            return this.selectionMode === 'multiple';
        },
        isSelected(rowData: TableRow) {
            if (rowData && this.selection) {
                if (this.dataKey) {
                    return this.d_selectionKeys ? this.d_selectionKeys[resolveFieldData(rowData, this.dataKey)] !== undefined : false;
                } else {
                    if (this.selection instanceof Array) return this.findIndexInSelection(rowData) > -1;
                    else return this.equals(rowData, this.selection);
                }
            }

            return false;
        },
        findIndexInSelection(rowData: TableRow) {
            return this.findIndex(rowData, this.selection);
        },
        findIndex(rowData: TableRow, collection: TableRow | TableRow[] | null) {
            let index = -1;

            if (Array.isArray(collection) && collection.length) {
                for (let i = 0; i < collection.length; i++) {
                    if (this.equals(rowData, collection[i])) {
                        index = i;
                        break;
                    }
                }
            }

            return index;
        },
        updateSelectionKeys(selection: TableRow | TableRow[] | null) {
            this.d_selectionKeys = {};

            if (Array.isArray(selection)) {
                for (let data of selection) {
                    this.d_selectionKeys[String(resolveFieldData(data, this.dataKey))] = 1;
                }
            } else {
                this.d_selectionKeys[String(resolveFieldData(selection, this.dataKey))] = 1;
            }
        },
        updateEditingRowKeys(editingRows: TableRow[] | null) {
            if (editingRows && editingRows.length) {
                this.d_editingRowKeys = {};

                for (let data of editingRows) {
                    this.d_editingRowKeys[String(resolveFieldData(data, this.dataKey))] = 1;
                }
            } else {
                this.d_editingRowKeys = null;
            }
        },
        equals(data1: TableRow, data2: TableRow) {
            return this.compareSelectionBy === 'equals' ? data1 === data2 : equals(data1, data2, this.dataKey);
        },
        selectRange(event: Event) {
            if (this.rangeRowIndex === null || this.anchorRowIndex === null) return;

            let rangeStart, rangeEnd;

            if (this.rangeRowIndex > this.anchorRowIndex) {
                rangeStart = this.anchorRowIndex;
                rangeEnd = this.rangeRowIndex;
            } else if (this.rangeRowIndex < this.anchorRowIndex) {
                rangeStart = this.rangeRowIndex;
                rangeEnd = this.anchorRowIndex;
            } else {
                rangeStart = this.rangeRowIndex;
                rangeEnd = this.rangeRowIndex;
            }

            if (this.lazy && this.paginator) {
                rangeStart -= this.d_first;
                rangeEnd -= this.d_first;
            }

            const value = this.processedData;
            let _selection = [];

            for (let i = rangeStart; i <= rangeEnd; i++) {
                let rangeRowData = value[i];

                _selection.push(rangeRowData);
                this.$emit('row-select', { originalEvent: event, data: rangeRowData, type: 'row' });
            }

            this.$emit('update:selection', _selection);
        },
        generateCSV(options?: DataTableExportCSVOptions, data?: TableRow[]) {
            let csv = '\ufeff';

            if (!data) {
                data = this.processedData;

                if (options && options.selectionOnly) data = Array.isArray(this.selection) ? this.selection : this.selection ? [this.selection] : [];
                else if (this.frozenValue) data = data ? [...this.frozenValue, ...data] : this.frozenValue;
            }

            //headers
            let headerInitiated = false;

            for (let i = 0; i < this.columns.length; i++) {
                let column = this.columns[i];

                if (this.columnProp(column, 'exportable') !== false && this.columnProp(column, 'field')) {
                    if (headerInitiated) csv += this.csvSeparator;
                    else headerInitiated = true;

                    csv += '"' + (this.columnProp(column, 'exportHeader') || this.columnProp(column, 'header') || this.columnProp(column, 'field')) + '"';
                }
            }

            //body
            if (data) {
                data.forEach((record) => {
                    csv += '\n';
                    let rowInitiated = false;

                    for (let i = 0; i < this.columns.length; i++) {
                        let column = this.columns[i];

                        if (this.columnProp(column, 'exportable') !== false && this.columnProp(column, 'field')) {
                            if (rowInitiated) csv += this.csvSeparator;
                            else rowInitiated = true;

                            let cellData = resolveFieldData(record, this.columnProp(column, 'field'));

                            if (cellData != null) {
                                if (this.exportFunction) {
                                    cellData = this.exportFunction({
                                        data: cellData,
                                        field: this.columnProp(column, 'field')
                                    });
                                } else cellData = String(cellData).replace(/"/g, '""');
                            } else cellData = '';

                            csv += '"' + cellData + '"';
                        }
                    }
                });
            }

            //footers
            let footerInitiated = false;

            for (let i = 0; i < this.columns.length; i++) {
                let column = this.columns[i];

                if (i === 0) csv += '\n';

                if (this.columnProp(column, 'exportable') !== false && this.columnProp(column, 'exportFooter')) {
                    if (footerInitiated) csv += this.csvSeparator;
                    else footerInitiated = true;

                    csv += '"' + (this.columnProp(column, 'exportFooter') || this.columnProp(column, 'footer') || this.columnProp(column, 'field')) + '"';
                }
            }

            return csv;
        },
        exportCSV(options?: DataTableExportCSVOptions, data?: TableRow[]) {
            const csv = this.generateCSV(options, data);
            exportCSV(csv, this.exportFilename);
        },
        resetPage() {
            this.d_first = 0;
            this.$emit('update:first', this.d_first);
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
            const resizeHelper = this.$refs.resizeHelper as HTMLElement;
            let containerLeft = getOffset(this.$el).left;

            this.$el.setAttribute('data-p-unselectable-text', 'true');
            !this.isUnstyled && addStyle(this.$el, { 'user-select': 'none' });
            resizeHelper.style.height = this.$el.offsetHeight + 'px';
            resizeHelper.style.top = 0 + 'px';
            resizeHelper.style.left = event.pageX - containerLeft + this.$el.scrollLeft + 'px';

            resizeHelper.style.display = 'block';
        },
        onColumnResizeEnd() {
            const resizeHelper = this.$refs.resizeHelper as HTMLElement;
            const resizeColumn = this.resizeColumnElement;

            if (!resizeColumn) return;

            let delta = isRTL(this.$el) ? this.lastResizeHelperX - resizeHelper.offsetLeft : resizeHelper.offsetLeft - this.lastResizeHelperX;
            let columnWidth = resizeColumn.offsetWidth;
            let newColumnWidth = columnWidth + delta;
            let minWidth = resizeColumn.style.minWidth || 15;

            if (columnWidth + delta > parseInt(String(minWidth), 10)) {
                if (this.columnResizeMode === 'fit') {
                    let nextColumn = resizeColumn.nextElementSibling;
                    const nextColumnWidth = nextColumn instanceof HTMLElement ? nextColumn.offsetWidth - delta : 0;

                    if (newColumnWidth > 15 && nextColumnWidth > 15) {
                        this.resizeTableCells(newColumnWidth, nextColumnWidth);
                    }
                } else if (this.columnResizeMode === 'expand') {
                    const tableWidth = (this.$refs.table as HTMLTableElement).offsetWidth + delta + 'px';

                    // Reasoning: resize table cells before updating the table width so that it can use existing computed cell widths and adjust only the one column.
                    this.resizeTableCells(newColumnWidth);
                    this.updateTableWidth(tableWidth);
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

            if (this.isStateful()) {
                this.saveState();
            }
        },
        resizeTableCells(newColumnWidth: number, nextColumnWidth?: number) {
            const resizeColumn = this.resizeColumnElement;

            if (!resizeColumn) return;

            const colIndex = getIndex(resizeColumn);
            const widths: number[] = [];
            const headers = find(this.$refs.table as HTMLTableElement, 'thead[data-pc-section="thead"] > tr > th');
            const columnCount = resizeColumn.parentElement?.children.length ?? 0;

            headers.forEach((header) => widths.push(getOuterWidth(header)));

            widths[colIndex] = newColumnWidth;
            nextColumnWidth && (widths[colIndex + 1] = nextColumnWidth);

            this.cacheColumnWidthsByKey(widths.slice(0, columnCount));
            this.addColumnWidthStyles(widths);
        },
        getVisibleColumnKeys(): ColumnKey[] | null {
            if (this.headerColumnGroup) {
                return null;
            }

            const keys: ColumnKey[] = [];

            (this.columns || []).forEach((column, index) => {
                if (this.columnProp(column, 'hidden') || (this.rowGroupMode === 'subheader' && this.groupRowsBy === this.columnProp(column, 'field'))) {
                    return;
                }

                keys.push(this.columnProp(column, 'columnKey') || this.columnProp(column, 'field') || index);
            });

            return keys.length > 0 && new Set(keys).size === keys.length ? keys : null;
        },
        cacheColumnWidthsByKey(widths: ColumnWidth[]) {
            const keys = this.getVisibleColumnKeys();
            const values = (keys || []).map((_, index) => parseFloat(String(widths[index])));

            if (!keys || widths.length !== keys.length || values.some((value) => !isFinite(value) || value <= 0)) {
                return;
            }

            const columnWidths = (this.columnWidthsByKey ??= new Map());
            keys.forEach((key, index) => columnWidths.set(key, values[index]));
            this.columnWidthsKeys = keys;
        },
        restoreColumnWidthsByKey() {
            const columnWidths = this.columnWidthsByKey;

            if (!this.resizableColumns || !columnWidths) {
                return;
            }

            const keys = this.getVisibleColumnKeys();

            if (!keys || this.isSameColumnWidthKeys(keys) || !keys.some((key) => columnWidths.has(key))) {
                return;
            }

            const widths = keys.map((key) => columnWidths.get(key));

            this.addColumnWidthStyles(widths);

            if (this.columnResizeMode === 'expand' && widths.every((width) => width !== undefined)) {
                this.updateTableWidth(widths.reduce((total, width) => total + (width ?? 0), 0) + 'px');
            }

            this.columnWidthsKeys = keys;
        },
        isSameColumnWidthKeys(keys: ColumnKey[]) {
            return !!this.columnWidthsKeys && this.columnWidthsKeys.length === keys.length && this.columnWidthsKeys.every((key, index) => key === keys[index]);
        },
        updateTableWidth(width: string) {
            const applyWidth = (el?: HTMLElement) => {
                !!el && (el.style.width = el.style.minWidth = width);
            };

            applyWidth(this.$refs.table as HTMLTableElement | undefined);

            if (!this.virtualScrollerDisabled) {
                applyWidth((this.$refs.bodyRef as { $el: HTMLTableSectionElement } | undefined)?.$el);
                applyWidth((this.$refs.frozenBodyRef as { $el: HTMLTableSectionElement } | undefined)?.$el);
            }
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
        onColumnHeaderMouseDown(e: ColumnEvent<MouseEvent>) {
            const event = e.originalEvent;
            const column = e.column;

            const { target, currentTarget } = event;

            if (
                this.reorderableColumns &&
                this.columnProp(column, 'reorderableColumn') !== false &&
                target instanceof Element &&
                currentTarget instanceof HTMLElement
            ) {
                currentTarget.draggable = !(
                    target.nodeName === 'INPUT' ||
                    target.nodeName === 'TEXTAREA' ||
                    getAttribute(target, '[data-pc-section="columnresizer"]')
                );
            }
        },
        onColumnHeaderDragStart(e: ColumnEvent<DragEvent>) {
            const { originalEvent: event, column } = e;

            if (this.columnResizing) {
                event.preventDefault();

                return;
            }

            this.colReorderIconWidth = getHiddenElementOuterWidth(this.$refs.reorderIndicatorUp as HTMLElement);
            this.colReorderIconHeight = getHiddenElementOuterHeight(this.$refs.reorderIndicatorUp as HTMLElement);

            this.draggedColumn = column;
            this.draggedColumnElement = this.findParentHeader(event.target);
            event.dataTransfer?.setData('text', 'b'); // Firefox requires this to make dragging possible
        },
        onColumnHeaderDragOver(e: ColumnEvent<DragEvent>) {
            const { originalEvent: event, column } = e;
            const upIndicator = this.$refs.reorderIndicatorUp as HTMLElement;
            const downIndicator = this.$refs.reorderIndicatorDown as HTMLElement;
            let dropHeader = this.findParentHeader(event.target);

            if (this.reorderableColumns && this.draggedColumnElement && dropHeader && !this.columnProp(column, 'frozen')) {
                event.preventDefault();
                let containerOffset = getOffset(this.$el);
                let dropHeaderOffset = getOffset(dropHeader);

                if (this.draggedColumnElement !== dropHeader) {
                    let targetLeft = dropHeaderOffset.left - containerOffset.left;
                    let columnCenter = dropHeaderOffset.left + dropHeader.offsetWidth / 2;

                    upIndicator.style.top = dropHeaderOffset.top - containerOffset.top - (this.colReorderIconHeight - 1) + 'px';
                    downIndicator.style.top = dropHeaderOffset.top - containerOffset.top + dropHeader.offsetHeight + 'px';

                    if (event.pageX > columnCenter) {
                        upIndicator.style.left = targetLeft + dropHeader.offsetWidth - Math.ceil(this.colReorderIconWidth / 2) + 'px';
                        downIndicator.style.left = targetLeft + dropHeader.offsetWidth - Math.ceil(this.colReorderIconWidth / 2) + 'px';
                        this.dropPosition = 1;
                    } else {
                        upIndicator.style.left = targetLeft - Math.ceil(this.colReorderIconWidth / 2) + 'px';
                        downIndicator.style.left = targetLeft - Math.ceil(this.colReorderIconWidth / 2) + 'px';
                        this.dropPosition = -1;
                    }

                    upIndicator.style.display = 'block';
                    downIndicator.style.display = 'block';
                }
            }
        },
        onColumnHeaderDragLeave(e: ColumnEvent<DragEvent>) {
            const { originalEvent: event } = e;
            const upIndicator = this.$refs.reorderIndicatorUp as HTMLElement;
            const downIndicator = this.$refs.reorderIndicatorDown as HTMLElement;

            if (this.reorderableColumns && this.draggedColumnElement) {
                event.preventDefault();
                upIndicator.style.display = 'none';
                downIndicator.style.display = 'none';
            }
        },
        onColumnHeaderDrop(e: ColumnEvent<DragEvent>) {
            const { originalEvent: event, column } = e;
            const upIndicator = this.$refs.reorderIndicatorUp as HTMLElement;
            const downIndicator = this.$refs.reorderIndicatorDown as HTMLElement;

            event.preventDefault();

            const dropHeader = this.findParentHeader(event.target);

            if (this.draggedColumnElement && dropHeader) {
                let dragIndex = getIndex(this.draggedColumnElement);
                let dropIndex = getIndex(dropHeader);
                let allowDrop = dragIndex !== dropIndex;

                if (allowDrop && ((dropIndex - dragIndex === 1 && this.dropPosition === -1) || (dropIndex - dragIndex === -1 && this.dropPosition === 1))) {
                    allowDrop = false;
                }

                if (allowDrop) {
                    const isSameColumn = (col1: VNode, col2: VNode | null) =>
                        this.columnProp(col1, 'columnKey') || this.columnProp(col2, 'columnKey')
                            ? this.columnProp(col1, 'columnKey') === this.columnProp(col2, 'columnKey')
                            : this.columnProp(col1, 'field') === this.columnProp(col2, 'field');
                    let dragColIndex = this.columns.findIndex((child) => isSameColumn(child, this.draggedColumn));
                    let dropColIndex = this.columns.findIndex((child) => isSameColumn(child, column));
                    const widths: number[] = [];
                    let headers = find(this.$el, 'thead[data-pc-section="thead"] > tr > th');

                    headers.forEach((header) => widths.push(getOuterWidth(header)));
                    const movedItem = widths.find((_, index) => index === dragColIndex);
                    const remainingItems = widths.filter((_, index) => index !== dragColIndex);
                    const reorderedWidths = [...remainingItems.slice(0, dropColIndex), movedItem, ...remainingItems.slice(dropColIndex)];

                    this.addColumnWidthStyles(reorderedWidths);

                    if (dropColIndex < dragColIndex && this.dropPosition === 1) {
                        dropColIndex++;
                    }

                    if (dropColIndex > dragColIndex && this.dropPosition === -1) {
                        dropColIndex--;
                    }

                    reorderArray(this.columns, dragColIndex, dropColIndex);
                    this.updateReorderableColumns();

                    this.$emit('column-reorder', {
                        originalEvent: event,
                        dragIndex: dragColIndex,
                        dropIndex: dropColIndex
                    });
                }

                upIndicator.style.display = 'none';
                downIndicator.style.display = 'none';
                this.draggedColumnElement.draggable = false;
                this.draggedColumnElement = null;
                this.draggedColumn = null;
                this.dropPosition = null;
            }
        },
        findParentHeader(element: EventTarget | null): HTMLTableCellElement | null {
            return element instanceof Element ? element.closest<HTMLTableCellElement>('th') : null;
        },
        findColumnByKey(columns: VNode[] | null, key: ColumnKey) {
            if (columns && columns.length) {
                for (let i = 0; i < columns.length; i++) {
                    let column = columns[i];

                    if (this.columnProp(column, 'columnKey') === key || this.columnProp(column, 'field') === key) {
                        return column;
                    }
                }
            }

            return null;
        },
        onRowMouseDown(event: MouseEvent) {
            const { target, currentTarget } = event;

            if (!(target instanceof Element) || !(currentTarget instanceof HTMLElement)) return;

            currentTarget.draggable =
                getAttribute(target, 'data-pc-section') === 'reorderablerowhandle' ||
                (target.parentElement !== null && getAttribute(target.parentElement, 'data-pc-section') === 'reorderablerowhandle');
        },
        onRowDragStart(e: RowDragEvent) {
            const event = e.originalEvent;
            const index = e.index;

            this.rowDragging = true;
            this.draggedRowIndex = index;
            event.dataTransfer?.setData('text', 'b'); // For firefox
        },
        onRowDragOver(e: RowDragEvent) {
            const event = e.originalEvent;
            const index = e.index;

            if (this.rowDragging && this.draggedRowIndex !== index) {
                const rowElement = event.currentTarget;

                if (!(rowElement instanceof HTMLElement)) return;

                let rowY = getOffset(rowElement).top;
                let pageY = event.pageY;
                let rowMidY = rowY + getOuterHeight(rowElement) / 2;
                let prevRowElement = rowElement.previousElementSibling;

                if (pageY < rowMidY) {
                    rowElement.setAttribute('data-p-datatable-dragpoint-bottom', 'false');
                    !this.isUnstyled && removeClass(rowElement, 'rs-datatable-dragpoint-bottom');

                    this.droppedRowIndex = index;

                    if (prevRowElement) {
                        prevRowElement.setAttribute('data-p-datatable-dragpoint-bottom', 'true');
                        !this.isUnstyled && addClass(prevRowElement, 'rs-datatable-dragpoint-bottom');
                    } else {
                        rowElement.setAttribute('data-p-datatable-dragpoint-top', 'true');
                        !this.isUnstyled && addClass(rowElement, 'rs-datatable-dragpoint-top');
                    }
                } else {
                    if (prevRowElement) {
                        prevRowElement.setAttribute('data-p-datatable-dragpoint-bottom', 'false');
                        !this.isUnstyled && removeClass(prevRowElement, 'rs-datatable-dragpoint-bottom');
                    } else {
                        rowElement.setAttribute('data-p-datatable-dragpoint-top', 'true');
                        !this.isUnstyled && addClass(rowElement, 'rs-datatable-dragpoint-top');
                    }

                    this.droppedRowIndex = index + 1;
                    rowElement.setAttribute('data-p-datatable-dragpoint-bottom', 'true');
                    !this.isUnstyled && addClass(rowElement, 'rs-datatable-dragpoint-bottom');
                }

                event.preventDefault();
            }
        },
        onRowDragLeave(event: DragEvent) {
            const rowElement = event.currentTarget;

            if (!(rowElement instanceof HTMLElement)) return;

            let prevRowElement = rowElement.previousElementSibling;

            if (prevRowElement) {
                prevRowElement.setAttribute('data-p-datatable-dragpoint-bottom', 'false');
                !this.isUnstyled && removeClass(prevRowElement, 'rs-datatable-dragpoint-bottom');
            }

            rowElement.setAttribute('data-p-datatable-dragpoint-bottom', 'false');
            !this.isUnstyled && removeClass(rowElement, 'rs-datatable-dragpoint-bottom');
            rowElement.setAttribute('data-p-datatable-dragpoint-top', 'false');
            !this.isUnstyled && removeClass(rowElement, 'rs-datatable-dragpoint-top');
        },
        onRowDragEnd(event: DragEvent) {
            this.rowDragging = false;
            this.draggedRowIndex = null;
            this.droppedRowIndex = null;
            if (event.currentTarget instanceof HTMLElement) event.currentTarget.draggable = false;
        },
        onRowDrop(event: DragEvent) {
            if (this.droppedRowIndex != null && this.draggedRowIndex != null) {
                let dropIndex = this.draggedRowIndex > this.droppedRowIndex ? this.droppedRowIndex : this.droppedRowIndex === 0 ? 0 : this.droppedRowIndex - 1;
                let processedData = [...this.processedData];

                reorderArray(processedData, this.draggedRowIndex + this.d_first, dropIndex + this.d_first);

                this.$emit('row-reorder', {
                    originalEvent: event,
                    dragIndex: this.draggedRowIndex,
                    dropIndex: dropIndex,
                    value: processedData
                });
            }

            //cleanup
            this.onRowDragLeave(event);
            this.onRowDragEnd(event);
            event.preventDefault();
        },
        toggleRow(event: RowEvent & { expanded: boolean }) {
            const { expanded, ...rest } = event;
            const rowData = event.data;
            let expandedRows: TableRow[] | Record<string, boolean>;

            if (this.dataKey) {
                const value = String(resolveFieldData(rowData, this.dataKey));
                const keys = { ...(this.expandedRows as Record<string, boolean> | undefined) };

                expanded ? (keys[value] = true) : delete keys[value];
                expandedRows = keys;
            } else {
                const rows = Array.isArray(this.expandedRows) ? this.expandedRows : [];

                expandedRows = expanded ? [...rows, rowData] : rows.filter((row) => !this.equals(rowData, row));
            }

            this.$emit('update:expandedRows', expandedRows);
            expanded ? this.$emit('row-expand', rest) : this.$emit('row-collapse', rest);
        },
        toggleRowGroup(e: Omit<RowEvent, 'index'>) {
            const event = e.originalEvent;
            const data = e.data;
            const groupFieldValue = resolveFieldData(data, this.groupRowsBy);
            let _expandedRowGroups = this.expandedRowGroups ? [...this.expandedRowGroups] : [];

            if (this.isRowGroupExpanded(data)) {
                _expandedRowGroups = _expandedRowGroups.filter((group) => group !== groupFieldValue);
                this.$emit('update:expandedRowGroups', _expandedRowGroups);
                this.$emit('rowgroup-collapse', { originalEvent: event, data: groupFieldValue });
            } else {
                _expandedRowGroups.push(groupFieldValue);
                this.$emit('update:expandedRowGroups', _expandedRowGroups);
                this.$emit('rowgroup-expand', { originalEvent: event, data: groupFieldValue });
            }
        },
        isRowGroupExpanded(rowData: TableRow) {
            if (this.expandableRowGroups && this.expandedRowGroups) {
                let groupFieldValue = resolveFieldData(rowData, this.groupRowsBy);

                return this.expandedRowGroups.indexOf(groupFieldValue) > -1;
            }

            return false;
        },
        isStateful() {
            return this.stateKey != null;
        },
        getStorage() {
            switch (this.stateStorage) {
                case 'local':
                    return window.localStorage;

                case 'session':
                    return window.sessionStorage;

                default:
                    throw new Error(this.stateStorage + ' is not a valid value for the state storage, supported values are "local" and "session".');
            }
        },
        saveState() {
            const storage = this.getStorage();
            const state: PersistedState = {};

            if (this.paginator) {
                state.first = this.d_first;
                state.rows = this.d_rows;
            }

            if (this.d_sortField) {
                // Functions can't be serialized, so don't attempt to save them
                if (typeof this.d_sortField !== 'function') state.sortField = this.d_sortField;
                state.sortOrder = this.d_sortOrder;
            }

            if (this.d_multiSortMeta) {
                state.multiSortMeta = this.d_multiSortMeta;
            }

            if (this.hasFilters) {
                state.filters = this.filters;
            }

            if (this.resizableColumns) {
                this.saveColumnWidths(state);
            }

            if (this.reorderableColumns) {
                state.columnOrder = this.d_columnOrder;
            }

            if (this.expandedRows) {
                state.expandedRows = this.expandedRows;
            }

            if (this.expandedRowGroups) {
                state.expandedRowGroups = this.expandedRowGroups;
            }

            if (this.selection) {
                state.selection = this.selection;
                state.selectionKeys = this.d_selectionKeys;
            }

            if (Object.keys(state).length) {
                const serializedState = JSON.stringify(state);

                if (serializedState !== this.lastSavedState) {
                    storage.setItem(this.stateKey, serializedState);
                    this.lastSavedState = serializedState;
                    this.$emit('state-save', state);
                }
            }
        },
        restoreState() {
            const storage = this.getStorage();
            const stateString = storage.getItem(this.stateKey);
            if (stateString === null) return;
            const dateFormat = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;

            const reviver = (_key: string, value: unknown) => {
                if (typeof value === 'string' && dateFormat.test(value)) {
                    return new Date(value);
                }

                return value;
            };

            let parsedState: PersistedState | null = null;
            try {
                parsedState = JSON.parse(stateString, reviver) as PersistedState;
            } catch {
                // An invalid stored value is removed below.
            }
            if (!parsedState || typeof parsedState !== 'object') {
                storage.removeItem(this.stateKey);
                return;
            }

            const restoredState: PersistedState = {};

            if (this.paginator) {
                if (typeof parsedState.first === 'number') {
                    this.d_first = parsedState.first;
                    this.$emit('update:first', this.d_first);
                    restoredState.first = this.d_first;
                }
                if (typeof parsedState.rows === 'number') {
                    this.d_rows = parsedState.rows;
                    this.$emit('update:rows', this.d_rows);
                    restoredState.rows = this.d_rows;
                }
            }

            if (typeof parsedState.sortField === 'string') {
                this.d_sortField = parsedState.sortField;
                this.$emit('update:sortField', this.d_sortField);
                restoredState.sortField = this.d_sortField;
            }

            if (typeof parsedState.sortOrder === 'number') {
                this.d_sortOrder = parsedState.sortOrder;
                this.$emit('update:sortOrder', this.d_sortOrder);
                restoredState.sortOrder = this.d_sortOrder;
            }

            if (Array.isArray(parsedState.multiSortMeta)) {
                this.d_multiSortMeta = parsedState.multiSortMeta;
                this.$emit('update:multiSortMeta', this.d_multiSortMeta);
                restoredState.multiSortMeta = this.d_multiSortMeta;
            }

            if (this.hasFilters && typeof parsedState.filters === 'object' && parsedState.filters !== null) {
                this.d_filters = this.cloneFilters(parsedState.filters);
                this.$emit('update:filters', this.d_filters);
                restoredState.filters = this.d_filters;
            }

            if (this.resizableColumns) {
                if (typeof parsedState.columnWidths === 'string') {
                    this.columnWidthsState = parsedState.columnWidths;
                    restoredState.columnWidths = this.columnWidthsState;
                }
                if (typeof parsedState.columnWidthsByKey === 'object' && parsedState.columnWidthsByKey !== null) {
                    this.columnWidthsByKeyState = parsedState.columnWidthsByKey;
                    restoredState.columnWidthsByKey = this.columnWidthsByKeyState;
                }
                if (typeof parsedState.tableWidth === 'string') {
                    this.tableWidthState = parsedState.tableWidth;
                    restoredState.tableWidth = this.tableWidthState;
                }
            }

            if (this.reorderableColumns && Array.isArray(parsedState.columnOrder)) {
                this.d_columnOrder = parsedState.columnOrder;
                restoredState.columnOrder = this.d_columnOrder;
            }

            if (typeof parsedState.expandedRows === 'object' && parsedState.expandedRows !== null) {
                this.$emit('update:expandedRows', parsedState.expandedRows);
                restoredState.expandedRows = parsedState.expandedRows;
            }

            if (Array.isArray(parsedState.expandedRowGroups)) {
                this.$emit('update:expandedRowGroups', parsedState.expandedRowGroups);
                restoredState.expandedRowGroups = parsedState.expandedRowGroups;
            }

            if (typeof parsedState.selection === 'object' && parsedState.selection !== null) {
                if (typeof parsedState.selectionKeys === 'object' && parsedState.selectionKeys !== null) {
                    this.d_selectionKeys = parsedState.selectionKeys;
                    restoredState.selectionKeys = this.d_selectionKeys;
                }
                this.$emit('update:selection', parsedState.selection);
                restoredState.selection = parsedState.selection;
            }

            this.$emit('state-restore', restoredState);
        },
        saveColumnWidths(state: PersistedState) {
            const widths: number[] = [];
            let headers = find(this.$el, 'thead[data-pc-section="thead"] > tr > th');

            headers.forEach((header) => widths.push(getOuterWidth(header)));
            state.columnWidths = widths.join(',');

            const widthsByKey = this.getPersistableColumnWidths();

            widthsByKey && (state.columnWidthsByKey = widthsByKey);

            if (this.columnResizeMode === 'expand') {
                state.tableWidth = getOuterWidth(this.$refs.table) + 'px';
            }
        },
        getPersistableColumnWidths(): Record<string, number> | null {
            const widths: Record<string, number> = {};

            this.columnWidthsByKey &&
                this.columnWidthsByKey.forEach((width, key) => {
                    typeof key === 'string' && (widths[key] = width);
                });

            return Object.keys(widths).length ? widths : null;
        },
        addColumnWidthStyles(widths: ColumnWidth[]) {
            this.createStyleElement();

            let innerHTML = '';
            let selector = `[data-pc-name="datatable"][${this.$attrSelector}] > [data-pc-section="tablecontainer"] ${this.virtualScrollerDisabled ? '' : '> [data-pc-name="virtualscroller"]'} > table[data-pc-section="table"]`;

            widths.forEach((width, index) => {
                if (width === undefined) {
                    return;
                }

                let style = `width: ${width}px !important; max-width: ${width}px !important`;

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
        restoreColumnWidths() {
            if (this.columnResizeMode === 'expand' && this.tableWidthState) {
                const table = this.$refs.table as HTMLTableElement;

                table.style.width = this.tableWidthState;
                table.style.minWidth = this.tableWidthState;
            }

            const entries = Object.entries(this.columnWidthsByKeyState || {})
                .map(([key, width]) => [key, parseFloat(String(width))] as const)
                .filter(([, width]) => isFinite(width) && width > 0);

            if (entries.length) {
                this.columnWidthsByKey = new Map(entries);
                this.columnWidthsKeys = null;
                this.restoreColumnWidthsByKey();

                return;
            }

            if (this.columnWidthsState) {
                let widths = this.columnWidthsState.split(',');

                if (isNotEmpty(widths)) {
                    this.cacheColumnWidthsByKey(widths);
                    this.addColumnWidthStyles(widths);
                }
            }
        },
        onCellEditInit(event: DataTableCellEditInitEvent<TableRow>) {
            this.$emit('cell-edit-init', event);
        },
        onCellEditComplete(event: DataTableCellEditCompleteEvent<TableRow>) {
            this.$emit('cell-edit-complete', event);
        },
        onCellEditCancel(event: DataTableCellEditCancelEvent) {
            this.$emit('cell-edit-cancel', event);
        },
        onRowEditInit(event: DataTableRowEditInitEvent<TableRow>) {
            let _editingRows = this.editingRows ? [...this.editingRows] : [];

            _editingRows.push(event.data);
            this.$emit('update:editingRows', _editingRows);
            this.$emit('row-edit-init', event);
        },
        onRowEditSave(event: DataTableRowEditInitEvent<TableRow>) {
            const _editingRows = [...(this.editingRows ?? [])];

            _editingRows.splice(this.findIndex(event.data, _editingRows), 1);
            this.$emit('update:editingRows', _editingRows);
            this.$emit('row-edit-save', event);
        },
        onRowEditCancel(event: DataTableRowEditInitEvent<TableRow>) {
            const _editingRows = [...(this.editingRows ?? [])];

            _editingRows.splice(this.findIndex(event.data, _editingRows), 1);
            this.$emit('update:editingRows', _editingRows);
            this.$emit('row-edit-cancel', event);
        },
        onEditingMetaChange(event: { data: TableRow; field: string; index: number; editing: boolean }) {
            let { data, field, index, editing } = event;
            let editingMeta = { ...this.d_editingMeta };
            let meta = editingMeta[index];

            if (editing) {
                !meta && (meta = editingMeta[index] = { data: { ...data }, fields: [] });
                meta['fields'].push(field);
            } else if (meta) {
                const fields = meta['fields'].filter((f) => f !== field);

                !fields.length ? delete editingMeta[index] : (meta['fields'] = fields);
            }

            this.d_editingMeta = editingMeta;
        },
        clearEditingMetaData() {
            if (this.editMode) {
                this.d_editingMeta = {};
            }
        },
        createLazyLoadEvent(event?: Event | PageState): LazyLoadEvent {
            return {
                originalEvent: event,
                first: this.d_first,
                rows: this.d_rows,
                sortField: this.d_sortField,
                sortOrder: this.d_sortOrder,
                multiSortMeta: this.d_multiSortMeta,
                filters: this.d_filters
            };
        },
        hasGlobalFilter() {
            return this.filters && Object.prototype.hasOwnProperty.call(this.filters, 'global');
        },
        onFilterChange(filters: DataTableFilterMeta) {
            this.d_filters = filters;
        },
        onFilterApply() {
            this.d_first = 0;
            this.$emit('update:first', this.d_first);
            this.$emit('update:filters', this.d_filters);

            if (this.lazy) {
                this.$emit('filter', this.createLazyLoadEvent());
            }
        },
        cloneFilters(filters: DataTableFilterMeta | null): DataTableFilterMeta {
            const cloned: DataTableFilterMeta = {};

            if (filters) {
                Object.entries(filters).forEach(([prop, value]) => {
                    if (typeof value === 'object' && value !== null && 'operator' in value && value.operator) {
                        cloned[prop] = { operator: value.operator, constraints: value.constraints.map((constraint) => ({ ...constraint })) };
                    } else {
                        cloned[prop] = { ...(value as DataTableFilterMetaData) };
                    }
                });
            }

            return cloned;
        },
        updateReorderableColumns() {
            const columnOrder: ColumnKey[] = [];

            this.columns.forEach((col) => columnOrder.push(this.columnProp(col, 'columnKey') || this.columnProp(col, 'field')));
            this.d_columnOrder = columnOrder;
        },
        createStyleElement() {
            if (this.styleElement) {
                return;
            }

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
        dataToRender(data?: TableRow[]): TableRow[] {
            const _data = data || this.processedData;

            if (_data && this.paginator) {
                const first = this.lazy ? 0 : this.d_first;

                return _data.slice(first, first + this.d_rows);
            }

            return _data;
        },
        getVirtualScrollerRef() {
            return this.$refs.virtualScroller;
        },
        hasSpacerStyle(style: unknown) {
            return isNotEmpty(style);
        },
        updateRowGroupHeights() {
            if (this.rowGroupMode !== 'subheader' || !this.groupRowsBy || this.virtualScrollerDisabled) {
                return;
            }

            const table = this.$refs.table as HTMLTableElement | undefined;
            const header = findSingle(table, '[data-pc-section="rowgroupheader"]');
            const footer = findSingle(table, '[data-pc-section="rowgroupfooter"]');

            if (header instanceof HTMLElement) {
                const height = getOuterHeight(header);

                if (height && height !== this.d_rowGroupHeaderHeight) {
                    this.d_rowGroupHeaderHeight = height;
                }
            }

            if (footer instanceof HTMLElement) {
                const height = getOuterHeight(footer);

                if (height && height !== this.d_rowGroupFooterHeight) {
                    this.d_rowGroupFooterHeight = height;
                }
            }
        },
        getRenderedWindowSize(slotProps?: RenderWindow) {
            if (!slotProps || !slotProps.rows || !slotProps.rows.length) {
                return 0;
            }

            const rows = this.dataToRender(slotProps.rows);
            const fn = this.getItemSize;

            if (typeof fn !== 'function') {
                return rows.length * (slotProps.itemSize || 0);
            }

            let total = 0;

            for (let i = 0; i < rows.length; i++) {
                total += fn(slotProps.getItemOptions?.(i).index ?? i);
            }

            return total;
        }
    },
    computed: {
        columns(): VNode[] {
            const cols = this.d_columns.get(this);

            if (cols && this.reorderableColumns && this.d_columnOrder) {
                const orderedColumns: VNode[] = [];

                for (let columnKey of this.d_columnOrder) {
                    let column = this.findColumnByKey(cols, columnKey);

                    if (column && !this.columnProp(column, 'hidden')) {
                        orderedColumns.push(column);
                    }
                }

                return [...orderedColumns, ...cols.filter((item) => orderedColumns.indexOf(item) < 0)];
            }

            return cols ?? [];
        },
        columnGroups() {
            return this.d_columnGroups.get(this);
        },
        headerColumnGroup() {
            return this.columnGroups?.find((group) => this.columnProp(group, 'type') === 'header');
        },
        footerColumnGroup() {
            return this.columnGroups?.find((group) => this.columnProp(group, 'type') === 'footer');
        },
        hasFilters() {
            return this.filters && Object.keys(this.filters).length > 0 && this.filters.constructor === Object;
        },
        processedData(): TableRow[] {
            let data = this.value || [];

            if (!this.lazy && !this.virtualScrollerOptions?.lazy) {
                if (data && data.length) {
                    if (this.hasFilters) {
                        data = this.filter(data);
                    }

                    if (this.sorted) {
                        if (this.sortMode === 'single') data = this.sortSingle(data);
                        else if (this.sortMode === 'multiple') data = this.sortMultiple(data);
                    }
                }
            }

            return data;
        },
        totalRecordsLength() {
            if (this.lazy) {
                return this.totalRecords;
            } else {
                const data = this.processedData;

                return data ? data.length : 0;
            }
        },
        empty() {
            const data = this.processedData;

            return !data || data.length === 0;
        },
        getItemSize(): ((index: number) => number) | null {
            const itemSize = (this.virtualScrollerOptions && this.virtualScrollerOptions.itemSize) || 0;
            const customItemSize = this.virtualScrollerOptions && this.virtualScrollerOptions.getItemSize;
            const groupRowsBy = this.groupRowsBy;
            const subheader = this.rowGroupMode === 'subheader' && !!groupRowsBy;

            if (!subheader) {
                return customItemSize || null;
            }

            const items = this.processedData;
            const expandable = this.expandableRowGroups;
            const expandedGroups = this.expandedRowGroups;
            const headerHeight = this.d_rowGroupHeaderHeight;
            const footerHeight = this.d_rowGroupFooterHeight;
            const hasGroupHeader = !!this.$slots.groupheader;
            const hasGroupFooter = !!this.$slots.groupfooter;

            return (index: number) => {
                if (!items || index < 0 || index >= items.length) {
                    return itemSize;
                }

                const groupValue = resolveFieldData(items[index], groupRowsBy);
                const isFirstOfGroup = index === 0 || resolveFieldData(items[index - 1], groupRowsBy) !== groupValue;
                const isLastOfGroup = index === items.length - 1 || resolveFieldData(items[index + 1], groupRowsBy) !== groupValue;
                const isExpanded = !expandable || (expandedGroups && expandedGroups.indexOf(groupValue) > -1);
                const rowHeight = isExpanded ? (typeof customItemSize === 'function' ? customItemSize(index) : itemSize) : 0;
                const groupHeaderHeight = isFirstOfGroup && hasGroupHeader ? headerHeight || itemSize : 0;
                const groupFooterHeight = isLastOfGroup && hasGroupFooter && isExpanded ? footerHeight || itemSize : 0;

                return groupHeaderHeight + rowHeight + groupFooterHeight;
            };
        },
        paginatorTop() {
            return this.paginator && this.paginatorPosition !== 'bottom';
        },
        paginatorBottom() {
            return this.paginator && this.paginatorPosition !== 'top';
        },
        sorted() {
            return this.d_sortField || (this.d_multiSortMeta && this.d_multiSortMeta.length > 0);
        },
        selectionArray(): TableRow[] {
            return Array.isArray(this.selection) ? this.selection : [];
        },
        allRowsSelected() {
            if (this.selectAll !== null) {
                return this.selectAll;
            } else {
                const val = this.frozenValue ? [...this.frozenValue, ...this.processedData] : this.processedData;

                return isNotEmpty(val) && this.selectionArray.length > 0 && val.every((v) => this.selectionArray.some((s) => this.equals(s, v)));
            }
        },
        groupRowSortField() {
            return this.sortMode === 'single' ? this.sortField : this.d_groupRowsSortMeta ? this.d_groupRowsSortMeta.field : null;
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
        rowEditButtonProps() {
            return {
                ...{
                    init: { severity: 'secondary', text: true, rounded: true },
                    save: { severity: 'secondary', text: true, rounded: true },
                    cancel: { severity: 'secondary', text: true, rounded: true }
                },
                ...this.editButtonProps
            };
        },
        virtualScrollerDisabled() {
            return isEmpty(this.virtualScrollerOptions) || !this.scrollable;
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
        DTPaginator: Paginator,
        DTTableHeader: TableHeader,
        DTTableBody: TableBody,
        DTTableFooter: TableFooter,
        DTVirtualScroller: VirtualScroller,
        ArrowDownIcon: ArrowDownIcon,
        ArrowUpIcon: ArrowUpIcon,
        SpinnerIcon: SpinnerIcon
    }
});
</script>
