<template>
    <tbody :ref="bodyRef" :class="cx('tbody')" role="rowgroup" :style="bodyContentStyle" :data-p="dataP" v-bind="ptm('tbody', ptmTBodyOptions)">
        <template v-if="!empty">
            <template v-for="(rowData, rowIndex) of value" :key="getRowKey(rowData, rowIndex)">
                <DTBodyRow
                    :rowData="rowData"
                    :editingKey="getRowKey(rowData, rowIndex)"
                    :index="rowIndex"
                    :value="value"
                    :groupRowsValue="groupRowsValue"
                    :columns="columns"
                    :frozenRow="frozenRow"
                    :empty="empty"
                    :first="first"
                    :dataKey="dataKey"
                    :selection="selection"
                    :selectionKeys="selectionKeys"
                    :selectionMode="selectionMode"
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
                    :editingRowKeys="editingRowKeys"
                    :templates="templates"
                    :editButtonProps="editButtonProps"
                    :virtualScrollerContentProps="virtualScrollerContentProps"
                    :isVirtualScrollerDisabled="isVirtualScrollerDisabled"
                    :editingMeta="editingMeta"
                    :rowGroupHeaderStyle="rowGroupHeaderStyle"
                    :expandedRowId="$id"
                    :nameAttributeSelector="$attrSelector"
                    @rowgroup-toggle="$emit('rowgroup-toggle', $event)"
                    @row-click="$emit('row-click', $event)"
                    @row-dblclick="$emit('row-dblclick', $event)"
                    @row-rightclick="$emit('row-rightclick', $event)"
                    @row-touchend="$emit('row-touchend', $event)"
                    @row-keydown="$emit('row-keydown', $event)"
                    @row-mousedown="$emit('row-mousedown', $event)"
                    @row-dragstart="$emit('row-dragstart', $event)"
                    @row-dragover="$emit('row-dragover', $event)"
                    @row-dragleave="$emit('row-dragleave', $event)"
                    @row-dragend="$emit('row-dragend', $event)"
                    @row-drop="$emit('row-drop', $event)"
                    @row-toggle="$emit('row-toggle', $event)"
                    @radio-change="$emit('radio-change', $event)"
                    @checkbox-change="$emit('checkbox-change', $event)"
                    @cell-edit-init="$emit('cell-edit-init', $event)"
                    @cell-edit-complete="$emit('cell-edit-complete', $event)"
                    @cell-edit-cancel="$emit('cell-edit-cancel', $event)"
                    @row-edit-init="$emit('row-edit-init', $event)"
                    @row-edit-save="$emit('row-edit-save', $event)"
                    @row-edit-cancel="$emit('row-edit-cancel', $event)"
                    @editing-meta-change="$emit('editing-meta-change', $event)"
                    :unstyled="unstyled"
                    :pt="pt"
                />
            </template>
        </template>
        <DTBodyRow v-else :empty="empty" :columns="columns" :templates="templates" :unstyled="unstyled" :pt="pt" />
    </tbody>
</template>

<script lang="ts">
import { defineComponent, type ComponentPublicInstance, type CSSProperties, type PropType, type VNode } from 'vue';
import { cn } from '../internal/utils/index';
import { getOuterHeight } from '../internal/utils/dom/index';
import { resolveFieldData } from '../internal/utils/object/index';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import type { TableField } from './BaseDataTable.vue';
import BodyRow from './BodyRow.vue';
import { getEditingRowKey, type EditingDrafts } from './editing-drafts';
import type { VirtualScrollerContent } from './virtual-scroller-content';
import type { RowGroupFields } from './row-groups';

type TableBodyRef = Element | ComponentPublicInstance | null;

export default defineComponent({
    name: 'TableBody',
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
        value: {
            type: Array as PropType<Record<string, unknown>[]>,
            default: null
        },
        groupRowsValue: {
            type: Array,
            default: null
        },
        columns: {
            type: null as unknown as PropType<VNode[]>,
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
            type: [String, Function] as PropType<TableField>,
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
            type: [Array, Object],
            default: null
        },
        selection: {
            type: [Array, Object],
            default: null
        },
        selectionKeys: {
            type: null,
            default: null
        },
        selectionMode: {
            type: String,
            default: null
        },
        rowHover: {
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
        rowClass: {
            type: null,
            default: null
        },
        rowStyle: {
            type: null,
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
            type: null,
            default: null
        },
        editingMeta: {
            type: Map as PropType<EditingDrafts>,
            default: null
        },
        templates: {
            type: null,
            default: null
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
        }
    },
    data() {
        return {
            rowGroupHeaderStyleObject: {} as CSSProperties
        };
    },
    mounted() {
        if (this.frozenRow) {
            this.updateFrozenRowStickyPosition();
        }

        if (this.scrollable && this.rowGroupMode === 'subheader') {
            this.updateFrozenRowGroupHeaderStickyPosition();
        }
    },
    updated() {
        if (this.frozenRow) {
            this.updateFrozenRowStickyPosition();
        }

        if (this.scrollable && this.rowGroupMode === 'subheader') {
            this.updateFrozenRowGroupHeaderStickyPosition();
        }
    },
    methods: {
        getRowKey(rowData: unknown, rowIndex: number) {
            if (this.editMode) return getEditingRowKey(rowData, this.dataKey) ?? rowIndex;

            return this.dataKey ? resolveFieldData(rowData, this.dataKey) : rowIndex;
        },
        updateFrozenRowStickyPosition() {
            const body = this.$el as HTMLElement;
            const previous = body.previousElementSibling;

            body.style.top = (previous instanceof HTMLElement ? getOuterHeight(previous) : 0) + 'px';
        },
        updateFrozenRowGroupHeaderStickyPosition() {
            const header = (this.$el as HTMLElement).previousElementSibling;
            const tableHeaderHeight = header instanceof HTMLElement ? getOuterHeight(header) : 0;

            this.rowGroupHeaderStyleObject.top = tableHeaderHeight + 'px';
        },
        getVirtualScrollerProp<K extends keyof VirtualScrollerContent>(option: K, options?: VirtualScrollerContent) {
            return (options ?? this.virtualScrollerContentProps)?.[option];
        },
        bodyRef(el: TableBodyRef) {
            this.getVirtualScrollerProp('contentRef')?.(el);
        }
    },
    computed: {
        rowGroupHeaderStyle() {
            if (this.scrollable && this.isVirtualScrollerDisabled) {
                return { top: this.rowGroupHeaderStyleObject.top };
            }

            return null;
        },
        bodyContentStyle() {
            return this.getVirtualScrollerProp('contentStyle');
        },
        ptmTBodyOptions() {
            const { $parentInstance: parent } = this as typeof this & { $parentInstance?: { $parentInstance?: { scrollable?: boolean } } };

            return {
                context: {
                    scrollable: parent?.$parentInstance?.scrollable
                }
            };
        },
        dataP() {
            return cn({
                hoverable: this.rowHover || this.selectionMode,
                frozen: this.frozenRow
            });
        }
    },
    components: {
        DTBodyRow: BodyRow
    }
});
</script>
