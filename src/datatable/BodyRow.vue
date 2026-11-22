<template>
    <template v-if="!empty">
        <tr
            v-if="templates['groupheader'] && rowGroupMode === 'subheader' && shouldRenderRowGroupHeader"
            :class="cx('rowGroupHeader')"
            :style="rowGroupHeaderStyle"
            role="row"
            v-bind="ptm('rowGroupHeader')"
        >
            <td :colspan="Math.max(columnsLength, 1)" v-bind="{ ...getColumnPT('bodycell'), ...ptm('rowGroupHeaderCell') }">
                <button v-if="expandableRowGroups" :class="cx('rowToggleButton')" @click="onRowGroupToggle" type="button" v-bind="ptm('rowToggleButton')">
                    <component
                        v-if="templates['rowtoggleicon'] || templates['rowgrouptogglericon']"
                        :is="templates['rowtoggleicon'] || templates['rowgrouptogglericon']"
                        :expanded="isRowGroupExpanded"
                    />
                    <template v-else>
                        <span v-if="isRowGroupExpanded && expandedRowIcon" :class="[cx('rowToggleIcon'), expandedRowIcon]" v-bind="ptm('rowToggleIcon')" />
                        <ChevronDownIcon v-else-if="isRowGroupExpanded && !expandedRowIcon" :class="cx('rowToggleIcon')" v-bind="ptm('rowToggleIcon')" />
                        <span
                            v-else-if="!isRowGroupExpanded && collapsedRowIcon"
                            :class="[cx('rowToggleIcon'), collapsedRowIcon]"
                            v-bind="ptm('rowToggleIcon')"
                        />
                        <ChevronRightIcon v-else-if="!isRowGroupExpanded && !collapsedRowIcon" :class="cx('rowToggleIcon')" v-bind="ptm('rowToggleIcon')" />
                    </template>
                </button>
                <component :is="templates['groupheader']" :data="rowData" :index="rowIndex" />
            </td>
        </tr>
        <tr
            v-if="expandableRowGroups ? isRowGroupExpanded : true"
            :class="rowClasses"
            :style="rowStyles"
            :tabindex="rowTabindex"
            role="row"
            :aria-selected="selectionMode ? isSelected : undefined"
            @click="onRowClick"
            @dblclick="onRowDblClick"
            @contextmenu="onRowRightClick"
            @touchend="onRowTouchEnd"
            @keydown.self="onRowKeyDown"
            @mousedown="onRowMouseDown"
            @dragstart="onRowDragStart"
            @dragover="onRowDragOver"
            @dragleave="onRowDragLeave"
            @dragend="onRowDragEnd"
            @drop="onRowDrop"
            v-bind="getBodyRowPTOptions('bodyRow')"
            :data-p-index="rowIndex"
            :data-p-selectable-row="selectionMode ? true : false"
            :data-p-selected="selection && isSelected"
            :data-p-selected-contextmenu="contextMenuSelection && isSelectedWithContextMenu"
        >
            <template v-for="(col, i) of columns">
                <DTBodyCell
                    v-if="shouldRenderBodyCell(col)"
                    :key="columnProp(col, 'columnKey') || columnProp(col, 'field') || i"
                    :rowData="rowData"
                    :column="col"
                    :rowIndex="rowIndex"
                    :index="i"
                    :selected="isSelected"
                    :frozenRow="frozenRow"
                    :rowspan="rowGroupMode === 'rowspan' ? calculateRowGroupSize(col) : null"
                    :rowspanGroup="rowGroupMode === 'rowspan'"
                    :editMode="editMode"
                    :editing="editMode === 'row' && isRowEditing"
                    :editingKey="editingKey"
                    :editingMeta="editingMeta"
                    :virtualScrollerContentProps="virtualScrollerContentProps"
                    :ariaControls="expandedRowId + '_' + rowIndex + '_expansion'"
                    :name="nameAttributeSelector"
                    :isRowExpanded="rowExpanded"
                    :expandedRowIcon="expandedRowIcon"
                    :collapsedRowIcon="collapsedRowIcon"
                    :editButtonProps="editButtonProps"
                    @radio-change="onRadioChange"
                    @checkbox-change="onCheckboxChange"
                    @row-toggle="onRowToggle"
                    @cell-edit-init="onCellEditInit"
                    @cell-edit-complete="onCellEditComplete"
                    @cell-edit-cancel="onCellEditCancel"
                    @row-edit-init="onRowEditInit"
                    @row-edit-save="onRowEditSave"
                    @row-edit-cancel="onRowEditCancel"
                    @editing-meta-change="onEditingMetaChange"
                    :unstyled="unstyled"
                    :pt="pt"
                />
            </template>
        </tr>
        <tr
            v-if="templates['expansion'] && expandedRows && rowExpanded"
            :id="expandedRowId + '_' + rowIndex + '_expansion'"
            :class="cx('rowExpansion')"
            role="row"
            v-bind="ptm('rowExpansion')"
        >
            <td :colspan="columnsLength" v-bind="{ ...getColumnPT('bodycell'), ...ptm('rowExpansionCell') }">
                <component :is="templates['expansion']" :data="rowData" :index="rowIndex" />
            </td>
        </tr>
        <tr
            v-if="templates['groupfooter'] && rowGroupMode === 'subheader' && shouldRenderRowGroupFooter"
            :class="cx('rowGroupFooter')"
            role="row"
            v-bind="ptm('rowGroupFooter')"
        >
            <td :colspan="Math.max(columnsLength, 1)" v-bind="{ ...getColumnPT('bodycell'), ...ptm('rowGroupFooterCell') }">
                <component :is="templates['groupfooter']" :data="rowData" :index="rowIndex" />
            </td>
        </tr>
    </template>
    <tr v-else :class="cx('emptyMessage')" role="row" v-bind="ptm('emptyMessage')">
        <td :colspan="columnsLength" v-bind="{ ...getColumnPT('bodycell'), ...ptm('emptyMessageCell') }">
            <component v-if="templates.empty" :is="templates.empty" />
        </td>
    </tr>
</template>

<script lang="ts">
import { equals, isNotEmpty, resolveFieldData } from '../internal/utils/object/index';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import { getVNodeProp } from '../core/utils/Utils';
import ChevronDownIcon from '../icons/chevrondown/ChevronDownIcon.vue';
import ChevronRightIcon from '../icons/chevronright/ChevronRightIcon.vue';
import { defineComponent, mergeProps, type PropType, type Slots, type StyleValue, type VNode } from 'vue';
import BodyCell from './BodyCell.vue';
import type { EditingDrafts, EditingRowKey } from './editing-drafts';
import { isRowGroupField, rowGroupKey, sameRowGroup, type RowGroupFields } from './row-groups';
import type { VirtualScrollerContent } from './virtual-scroller-content';

type ExpandedRows = unknown[] | Record<PropertyKey, unknown>;

type BodyRowParent = { $parentInstance?: { rowHover?: boolean; selectionMode?: string; stripedRows?: boolean } };

export default defineComponent({
    name: 'BodyRow',
    hostName: 'DataTable',
    extends: BaseComponent,
    emits: [
        'rowgroup-toggle',
        'row-click',
        'row-dblclick',
        'row-rightclick',
        'row-touchend',
        'row-keydown',
        'row-mousedown',
        'row-dragstart',
        'row-dragover',
        'row-dragleave',
        'row-dragend',
        'row-drop',
        'row-toggle',
        'radio-change',
        'checkbox-change',
        'cell-edit-init',
        'cell-edit-complete',
        'cell-edit-cancel',
        'row-edit-init',
        'row-edit-save',
        'row-edit-cancel',
        'editing-meta-change'
    ],
    props: {
        rowData: {
            type: Object,
            default: null
        },
        index: {
            type: Number,
            default: 0
        },
        value: {
            type: Array,
            default: null
        },
        groupRowsValue: {
            type: Array,
            default: null
        },
        columns: {
            type: Array as PropType<VNode[]>,
            default: null
        },
        frozenRow: {
            type: Boolean,
            default: false
        },
        empty: {
            type: Boolean,
            default: false
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
            type: Array,
            default: null
        },
        first: {
            type: Number,
            default: 0
        },
        dataKey: {
            type: [String, Function],
            default: null
        },
        expandedRowIcon: {
            type: String,
            default: null
        },
        collapsedRowIcon: {
            type: String,
            default: null
        },
        expandedRows: {
            type: [Array, Object] as PropType<ExpandedRows>,
            default: null
        },
        selection: {
            type: [Array, Object],
            default: null
        },
        selectionKeys: {
            type: Object as PropType<Record<PropertyKey, unknown>>,
            default: null
        },
        selectionMode: {
            type: String,
            default: null
        },
        contextMenu: {
            type: Boolean,
            default: false
        },
        contextMenuSelection: {
            type: Object,
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
        rowGroupHeaderStyle: {
            type: [String, Array, Object] as PropType<StyleValue>,
            default: null
        },
        editMode: {
            type: String,
            default: null
        },
        compareSelectionBy: {
            type: String,
            default: 'deepEquals'
        },
        editingRows: {
            type: Array,
            default: null
        },
        editingRowKeys: {
            type: Object as PropType<Record<PropertyKey, unknown>>,
            default: null
        },
        editingMeta: {
            type: Map as PropType<EditingDrafts>,
            default: null
        },
        editingKey: {
            type: [String, Number, Symbol] as PropType<EditingRowKey>,
            default: null
        },
        templates: {
            type: Object as PropType<Slots>,
            default: () => ({})
        },
        scrollable: {
            type: Boolean,
            default: false
        },
        editButtonProps: {
            type: Object,
            default: null
        },
        virtualScrollerContentProps: {
            type: Object as PropType<VirtualScrollerContent>,
            default: null
        },
        isVirtualScrollerDisabled: {
            type: Boolean,
            default: false
        },
        expandedRowId: {
            type: String,
            default: null
        },
        nameAttributeSelector: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            d_rowExpanded: false
        };
    },
    watch: {
        expandedRows: {
            deep: true,
            immediate: true,
            handler(newValue: ExpandedRows | null) {
                this.d_rowExpanded = this.isExpanded(this.rowData, newValue);
            }
        },
        rowData(newValue) {
            this.d_rowExpanded = this.isExpanded(newValue, this.expandedRows);
        }
    },
    methods: {
        isExpanded(row: unknown, expandedRows: ExpandedRows | null) {
            if (this.dataKey) {
                const key: PropertyKey = resolveFieldData(row, this.dataKey);
                return (expandedRows as Record<PropertyKey, unknown> | null)?.[key] !== undefined;
            }

            return Array.isArray(expandedRows) && expandedRows.some((entry) => this.equals(row, entry));
        },
        columnProp(col: VNode, prop: string) {
            return getVNodeProp(col, prop);
        },
        getColumnPT(key: string) {
            const columnMetaData = {
                parent: {
                    instance: this,
                    props: this.$props,
                    state: this.$data
                }
            };

            return mergeProps(this.ptm(`column.${key}`, { column: columnMetaData }), this.ptm(`column.${key}`, columnMetaData));
        },
        getBodyRowPTOptions(key: string) {
            const { $parentInstance: parent } = this as typeof this & { $parentInstance?: BodyRowParent };
            const datatable = parent?.$parentInstance;

            return this.ptm(key, {
                context: {
                    index: this.rowIndex,
                    selectable: datatable?.rowHover || datatable?.selectionMode,
                    selected: this.isSelected,
                    stripedRows: datatable?.stripedRows || false
                }
            });
        },
        shouldRenderBodyCell(column: VNode) {
            if (this.columnProp(column, 'hidden')) return false;

            const field = this.columnProp(column, 'field');
            if (!isRowGroupField(this.groupRowsBy, field)) return true;
            if (this.rowGroupMode === 'subheader') return false;
            if (this.rowGroupMode !== 'rowspan') return true;

            const previous = this.value[this.index - 1];

            return !previous || this.hasExpansion(previous) || resolveFieldData(previous, field) !== resolveFieldData(this.rowData, field);
        },
        calculateRowGroupSize(column: VNode) {
            const field = this.columnProp(column, 'field');
            if (!isRowGroupField(this.groupRowsBy, field)) return null;

            const current = resolveFieldData(this.rowData, field);
            let index = this.index;

            // An expansion row occupies every column, so each span ends at the record above it.
            while (this.value[index + 1] && !this.hasExpansion(this.value[index]) && current === resolveFieldData(this.value[index + 1], field)) {
                index++;
            }

            return index === this.index ? null : index - this.index + 1;
        },
        hasExpansion(row: unknown) {
            return !!this.templates.expansion && this.isExpanded(row, this.expandedRows);
        },
        findIndexInSelection(data: unknown) {
            return Array.isArray(this.selection) ? this.findIndex(data, this.selection) : -1;
        },
        findIndex(data: unknown, collection: unknown[] | null) {
            let index = -1;

            if (collection && collection.length) {
                for (let i = 0; i < collection.length; i++) {
                    if (this.equals(data, collection[i])) {
                        index = i;
                        break;
                    }
                }
            }

            return index;
        },
        equals(data1: unknown, data2: unknown) {
            if (this.compareSelectionBy === 'equals') return data1 === data2;
            if (typeof this.dataKey === 'function') return resolveFieldData(data1, this.dataKey) === resolveFieldData(data2, this.dataKey);

            return equals(data1, data2, this.dataKey ?? undefined);
        },
        onRowGroupToggle(event: MouseEvent) {
            this.$emit('rowgroup-toggle', { originalEvent: event, data: this.rowData });
        },
        onRowClick(event: MouseEvent) {
            this.$emit('row-click', { originalEvent: event, data: this.rowData, index: this.rowIndex });
        },
        onRowDblClick(event: MouseEvent) {
            this.$emit('row-dblclick', { originalEvent: event, data: this.rowData, index: this.rowIndex });
        },
        onRowRightClick(event: MouseEvent) {
            this.$emit('row-rightclick', { originalEvent: event, data: this.rowData, index: this.rowIndex });
        },
        onRowTouchEnd(event: TouchEvent) {
            this.$emit('row-touchend', event);
        },
        onRowKeyDown(event: KeyboardEvent) {
            this.$emit('row-keydown', { originalEvent: event, data: this.rowData, index: this.rowIndex });
        },
        onRowMouseDown(event: MouseEvent) {
            this.$emit('row-mousedown', event);
        },
        onRowDragStart(event: DragEvent) {
            this.$emit('row-dragstart', { originalEvent: event, index: this.rowIndex });
        },
        onRowDragOver(event: DragEvent) {
            this.$emit('row-dragover', { originalEvent: event, index: this.rowIndex });
        },
        onRowDragLeave(event: DragEvent) {
            this.$emit('row-dragleave', event);
        },
        onRowDragEnd(event: DragEvent) {
            this.$emit('row-dragend', event);
        },
        onRowDrop(event: DragEvent) {
            this.$emit('row-drop', event);
        },
        onRowToggle(event: { originalEvent: Event; data: unknown }) {
            const expanded = !this.rowExpanded;
            if (this.rowGroupMode !== 'rowspan') this.d_rowExpanded = expanded;

            this.$emit('row-toggle', { ...event, expanded });
        },
        onRadioChange(event: unknown) {
            this.$emit('radio-change', event);
        },
        onCheckboxChange(event: unknown) {
            this.$emit('checkbox-change', event);
        },
        onCellEditInit(event: unknown) {
            this.$emit('cell-edit-init', event);
        },
        onCellEditComplete(event: unknown) {
            this.$emit('cell-edit-complete', event);
        },
        onCellEditCancel(event: unknown) {
            this.$emit('cell-edit-cancel', event);
        },
        onRowEditInit(event: unknown) {
            this.$emit('row-edit-init', event);
        },
        onRowEditSave(event: unknown) {
            this.$emit('row-edit-save', event);
        },
        onRowEditCancel(event: unknown) {
            this.$emit('row-edit-cancel', event);
        },
        onEditingMetaChange(event: unknown) {
            this.$emit('editing-meta-change', event);
        },
        getVirtualScrollerProp(option: 'getItemOptions', options?: VirtualScrollerContent) {
            return (options ?? this.virtualScrollerContentProps)?.[option];
        }
    },
    computed: {
        rowExpanded() {
            return this.rowGroupMode === 'rowspan' ? this.isExpanded(this.rowData, this.expandedRows) : this.d_rowExpanded;
        },
        rowIndex() {
            const getItemOptions = this.getVirtualScrollerProp('getItemOptions');

            return getItemOptions ? getItemOptions(this.index).index : this.index;
        },
        rowStyles() {
            return this.rowStyle?.(this.rowData);
        },
        rowClasses() {
            const rowStyleClass: unknown[] = [];
            let columnSelectionMode = null;

            if (this.rowClass) {
                let rowClassValue = this.rowClass(this.rowData);

                if (rowClassValue) {
                    rowStyleClass.push(rowClassValue);
                }
            }

            if (this.columns) {
                for (let col of this.columns) {
                    let _selectionMode = this.columnProp(col, 'selectionMode');

                    if (isNotEmpty(_selectionMode)) {
                        columnSelectionMode = _selectionMode;
                        break;
                    }
                }
            }

            return [this.cx('row', { rowData: this.rowData, index: this.rowIndex, columnSelectionMode }), rowStyleClass];
        },
        rowTabindex() {
            if (
                (this.selection === null || (Array.isArray(this.selection) && this.selection.length === 0)) &&
                (this.selectionMode === 'single' || this.selectionMode === 'multiple')
            ) {
                return this.rowIndex === 0 ? 0 : -1;
            }

            return -1;
        },
        isRowEditing() {
            if (this.rowData && this.editingRows) {
                if (this.dataKey) return this.editingRowKeys ? this.editingRowKeys[resolveFieldData(this.rowData, this.dataKey)] !== undefined : false;
                else return this.findIndex(this.rowData, this.editingRows) > -1;
            }

            return false;
        },
        isRowGroupExpanded() {
            if (this.expandableRowGroups && this.expandedRowGroups) {
                const groupFieldValue = rowGroupKey(this.rowData, this.groupRowsBy);

                return this.expandedRowGroups.some((group) => sameRowGroup(this.groupRowsBy, group, groupFieldValue));
            }

            return false;
        },
        isSelected() {
            if (this.rowData && this.selection) {
                if (this.dataKey) {
                    return this.selectionKeys ? this.selectionKeys[resolveFieldData(this.rowData, this.dataKey)] !== undefined : false;
                } else {
                    if (this.selection instanceof Array) return this.findIndexInSelection(this.rowData) > -1;
                    else return this.equals(this.rowData, this.selection);
                }
            }

            return false;
        },
        isSelectedWithContextMenu() {
            if (this.rowData && this.contextMenuSelection) {
                return this.equals(this.rowData, this.contextMenuSelection);
            }

            return false;
        },
        shouldRenderRowGroupHeader() {
            const groupRowsValue = this.groupRowsValue || this.value;
            const index = this.groupRowsValue ? this.rowIndex : this.index;
            const previous = groupRowsValue[index - 1];

            return (
                index === 0 ||
                (!!previous && !sameRowGroup(this.groupRowsBy, rowGroupKey(previous, this.groupRowsBy), rowGroupKey(this.rowData, this.groupRowsBy)))
            );
        },
        shouldRenderRowGroupFooter() {
            if (this.expandableRowGroups && !this.isRowGroupExpanded) return false;

            const groupRowsValue = this.groupRowsValue || this.value;
            const index = this.groupRowsValue ? this.rowIndex : this.index;
            const next = groupRowsValue[index + 1];

            return !next || !sameRowGroup(this.groupRowsBy, rowGroupKey(next, this.groupRowsBy), rowGroupKey(this.rowData, this.groupRowsBy));
        },
        columnsLength() {
            return (
                this.columns?.filter(
                    (column) =>
                        !this.columnProp(column, 'hidden') &&
                        (this.rowGroupMode !== 'subheader' || !isRowGroupField(this.groupRowsBy, this.columnProp(column, 'field')))
                ).length ?? 0
            );
        }
    },
    components: {
        DTBodyCell: BodyCell,
        ChevronDownIcon: ChevronDownIcon,
        ChevronRightIcon: ChevronRightIcon
    }
});
</script>
