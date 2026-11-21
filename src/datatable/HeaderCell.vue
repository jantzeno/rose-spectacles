<template>
    <th
        :style="containerStyle"
        :class="containerClass"
        :tabindex="columnProp('sortable') ? '0' : undefined"
        role="columnheader"
        :colspan="columnProp('colspan')"
        :rowspan="columnProp('rowspan')"
        :aria-sort="ariaSort"
        @click="onClick"
        @keydown="onKeyDown"
        @mousedown="onMouseDown"
        @dragstart="onDragStart"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @drop="onDrop"
        v-bind="{ ...getColumnPT('root'), ...getColumnPT('headerCell') }"
        :data-p-sortable-column="columnProp('sortable')"
        :data-p-resizable-column="resizableColumns"
        :data-p-sorted="isColumnSorted()"
        :data-p-filter-column="filterColumn"
        :data-p-frozen-column="columnProp('frozen')"
        :data-p-reorderable-column="reorderableColumns"
    >
        <span
            v-if="resizableColumns && !columnProp('frozen')"
            :class="cx('columnResizer')"
            @mousedown="onResizeStart"
            v-bind="getColumnPT('columnResizer')"
        ></span>
        <div :class="cx('columnHeaderContent')" v-bind="getColumnPT('columnHeaderContent')">
            <component v-if="columnSlots.header" :is="columnSlots.header" :column="column" />
            <span v-if="columnProp('header')" :class="cx('columnTitle')" v-bind="getColumnPT('columnTitle')">{{ columnProp('header') }}</span>
            <span v-if="columnProp('sortable')" v-bind="getColumnPT('sort')">
                <component
                    :is="columnSlots.sorticon || sortableColumnIcon"
                    :sorted="sortState.sorted"
                    :sortOrder="sortState.sortOrder"
                    :class="cx('sortIcon')"
                    v-bind="getColumnPT('sorticon')"
                />
            </span>
            <Badge v-if="isMultiSorted()" :class="cx('pcSortBadge')" :pt="getColumnPT('pcSortBadge')" :value="getBadgeValue()" size="small" />
            <DTHeaderCheckbox
                v-if="columnProp('selectionMode') === 'multiple' && filterDisplay !== 'row'"
                :checked="allRowsSelected"
                @change="onHeaderCheckboxChange"
                :disabled="empty"
                :headerCheckboxIconTemplate="columnSlots.headercheckboxicon"
                :column="column"
                :unstyled="unstyled"
                :pt="pt"
            />
            <DTColumnFilter
                v-if="filterDisplay === 'menu' && columnSlots.filter"
                :field="columnProp('filterField') || columnProp('field')"
                :type="columnProp('dataType')"
                display="menu"
                :showMenu="columnProp('showFilterMenu')"
                :filterElement="columnSlots.filter"
                :filterHeaderTemplate="columnSlots.filterheader"
                :filterFooterTemplate="columnSlots.filterfooter"
                :filterClearTemplate="columnSlots.filterclear"
                :filterApplyTemplate="columnSlots.filterapply"
                :filterIconTemplate="columnSlots.filtericon"
                :filterAddIconTemplate="columnSlots.filteraddicon"
                :filterRemoveIconTemplate="columnSlots.filterremoveicon"
                :filterClearIconTemplate="columnSlots.filterclearicon"
                :filters="filters"
                :filtersStore="filtersStore"
                :filterInputProps="filterInputProps"
                :filterButtonProps="filterButtonProps"
                @filter-change="$emit('filter-change', $event)"
                @filter-apply="$emit('filter-apply')"
                :filterMenuStyle="columnProp('filterMenuStyle')"
                :filterMenuClass="columnProp('filterMenuClass')"
                :showOperator="columnProp('showFilterOperator')"
                :showClearButton="columnProp('showClearButton')"
                :showApplyButton="columnProp('showApplyButton')"
                :showMatchModes="columnProp('showFilterMatchModes')"
                :showAddButton="columnProp('showAddButton')"
                :matchModeOptions="columnProp('filterMatchModeOptions')"
                :maxConstraints="columnProp('maxConstraints')"
                @operator-change="$emit('operator-change', $event)"
                @matchmode-change="$emit('matchmode-change', $event)"
                @constraint-add="$emit('constraint-add', $event)"
                @constraint-remove="$emit('constraint-remove', $event)"
                @apply-click="$emit('apply-click', $event)"
                :column="column"
                :unstyled="unstyled"
                :pt="pt"
            />
        </div>
    </th>
</template>

<script lang="ts">
import type { TableSortMeta } from './BaseDataTable.vue';
import { getColumnPassThroughProps } from '../internal/column-pass-through';
import { observeFrozenColumn, updateFrozenColumnOffset } from '../internal/frozen-column-layout';
import { getAttribute } from '../internal/utils/dom/index';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import { getVNodeProp } from '../core/utils/Utils';
import SortAltIcon from '../icons/sortalt/SortAltIcon.vue';
import SortAmountDownIcon from '../icons/sortamountdown/SortAmountDownIcon.vue';
import SortAmountUpAltIcon from '../icons/sortamountupalt/SortAmountUpAltIcon.vue';
import Badge from '../badge/Badge.vue';
import { defineComponent, mergeProps, type CSSProperties, type PropType, type Slots, type VNode } from 'vue';
import ColumnFilter from './ColumnFilter.vue';
import HeaderCheckbox from './HeaderCheckbox.vue';

export default defineComponent({
    name: 'HeaderCell',
    hostName: 'DataTable',
    extends: BaseComponent,
    emits: [
        'column-click',
        'column-mousedown',
        'column-dragstart',
        'column-dragover',
        'column-dragleave',
        'column-drop',
        'column-resizestart',
        'checkbox-change',
        'filter-change',
        'filter-apply',
        'operator-change',
        'matchmode-change',
        'constraint-add',
        'constraint-remove',
        'filter-clear',
        'apply-click'
    ],
    props: {
        column: {
            type: Object as PropType<VNode>,
            required: true
        },
        index: {
            type: Number,
            default: null
        },
        resizableColumns: {
            type: Boolean,
            default: false
        },
        groupRowsBy: {
            type: [Array, String, Function],
            default: null
        },
        sortMode: {
            type: String,
            default: 'single'
        },
        groupRowSortField: {
            type: [String, Function],
            default: null
        },
        sortField: {
            type: [String, Function],
            default: null
        },
        sortOrder: {
            type: Number,
            default: null
        },
        multiSortMeta: {
            type: Array as PropType<TableSortMeta[]>,
            default: null
        },
        allRowsSelected: {
            type: Boolean,
            default: false
        },
        empty: {
            type: Boolean,
            default: false
        },
        filterDisplay: {
            type: String,
            default: null
        },
        filters: {
            type: Object,
            default: null
        },
        filtersStore: {
            type: Object,
            default: null
        },
        filterColumn: {
            type: Boolean,
            default: false
        },
        reorderableColumns: {
            type: Boolean,
            default: false
        },
        filterInputProps: {
            type: null,
            default: null
        },
        filterButtonProps: {
            type: null,
            default: null
        }
    },
    data() {
        return {
            stopFrozenLayout: null as (() => void) | null,
            styleObject: {} as CSSProperties
        };
    },
    mounted() {
        this.syncFrozenLayout();
    },
    updated() {
        this.syncFrozenLayout();
    },
    beforeUnmount() {
        this.stopFrozenLayout?.();
    },
    methods: {
        columnProp(prop: string) {
            return getVNodeProp(this.column, prop);
        },
        getColumnPT(key: string) {
            const { $parentInstance: parent } = this as typeof this & { $parentInstance?: { $parentInstance?: { showGridlines?: boolean; size?: string } } };
            const columnMetaData = {
                props: getColumnPassThroughProps(this.column),
                parent: {
                    instance: this,
                    props: this.$props,
                    state: this.$data
                },
                context: {
                    index: this.index,
                    sortable: this.columnProp('sortable') === '' || this.columnProp('sortable'),
                    sorted: this.isColumnSorted(),
                    resizable: this.resizableColumns,
                    size: parent?.$parentInstance?.size,
                    showGridlines: parent?.$parentInstance?.showGridlines || false
                }
            };

            return mergeProps(
                this.ptm(`column.${key}`, { column: columnMetaData }),
                this.ptm(`column.${key}`, columnMetaData),
                this.ptmo(this.getColumnProp(), key, columnMetaData)
            );
        },
        getColumnProp() {
            return this.column.props && this.column.props.pt ? this.column.props.pt : undefined; //@todo:
        },
        onClick(event: MouseEvent) {
            this.$emit('column-click', { originalEvent: event, column: this.column });
        },
        onKeyDown(event: KeyboardEvent) {
            if (
                (event.code === 'Enter' || event.code === 'NumpadEnter' || event.code === 'Space') &&
                event.currentTarget instanceof HTMLTableCellElement &&
                event.currentTarget.nodeName === 'TH' &&
                getAttribute(event.currentTarget, 'data-p-sortable-column')
            ) {
                this.$emit('column-click', { originalEvent: event, column: this.column });
                event.preventDefault();
            }
        },
        onMouseDown(event: MouseEvent) {
            this.$emit('column-mousedown', { originalEvent: event, column: this.column });
        },
        onDragStart(event: DragEvent) {
            this.$emit('column-dragstart', { originalEvent: event, column: this.column });
        },
        onDragOver(event: DragEvent) {
            this.$emit('column-dragover', { originalEvent: event, column: this.column });
        },
        onDragLeave(event: DragEvent) {
            this.$emit('column-dragleave', { originalEvent: event, column: this.column });
        },
        onDrop(event: DragEvent) {
            this.$emit('column-drop', { originalEvent: event, column: this.column });
        },
        onResizeStart(event: MouseEvent) {
            this.$emit('column-resizestart', event);
        },
        getMultiSortMetaIndex() {
            return this.multiSortMeta?.findIndex((meta) => meta.field === this.columnProp('field') || meta.field === this.columnProp('sortField')) ?? -1;
        },
        getBadgeValue() {
            let index = this.getMultiSortMetaIndex();

            return this.groupRowsBy && this.groupRowsBy === this.groupRowSortField && index > -1 ? index : index + 1;
        },
        isMultiSorted() {
            return this.sortMode === 'multiple' && this.columnProp('sortable') && this.getMultiSortMetaIndex() > -1;
        },
        isColumnSorted() {
            return this.sortMode === 'single'
                ? this.sortField && (this.sortField === this.columnProp('field') || this.sortField === this.columnProp('sortField'))
                : this.isMultiSorted();
        },
        syncFrozenLayout() {
            if (!this.columnProp('frozen')) {
                this.stopFrozenLayout?.();
                this.stopFrozenLayout = null;
                return;
            }

            this.stopFrozenLayout ??= observeFrozenColumn(this.$el, this.updateStickyPosition);
            this.updateStickyPosition();
        },
        updateStickyPosition() {
            updateFrozenColumnOffset(this.$el, this.columnProp('alignFrozen'), this.styleObject);
        },
        onHeaderCheckboxChange(event: { originalEvent: Event; checked: boolean }) {
            this.$emit('checkbox-change', event);
        }
    },
    computed: {
        columnSlots(): Slots {
            return (this.column.children as Slots | null) ?? {};
        },
        containerClass() {
            return [this.cx('headerCell'), this.filterColumn ? this.columnProp('filterHeaderClass') : this.columnProp('headerClass'), this.columnProp('class')];
        },
        containerStyle() {
            let headerStyle = this.filterColumn ? this.columnProp('filterHeaderStyle') : this.columnProp('headerStyle');
            let columnStyle = this.columnProp('style');

            return this.columnProp('frozen') ? [columnStyle, headerStyle, this.styleObject] : [columnStyle, headerStyle];
        },
        sortState() {
            let sorted = false;
            let sortOrder: number | null | undefined = null;

            if (this.sortMode === 'single') {
                sorted = !!this.sortField && (this.sortField === this.columnProp('field') || this.sortField === this.columnProp('sortField'));
                sortOrder = sorted ? this.sortOrder : 0;
            } else if (this.sortMode === 'multiple') {
                let metaIndex = this.getMultiSortMetaIndex();

                if (metaIndex > -1) {
                    sorted = true;
                    sortOrder = this.multiSortMeta?.[metaIndex]?.order;
                }
            }

            return {
                sorted,
                sortOrder
            };
        },
        sortableColumnIcon() {
            const { sorted, sortOrder } = this.sortState;

            if (!sorted) return SortAltIcon;
            else if (sorted && (sortOrder ?? 0) > 0) return SortAmountUpAltIcon;
            else if (sorted && (sortOrder ?? 0) < 0) return SortAmountDownIcon;

            return null;
        },
        ariaSort(): 'ascending' | 'descending' | 'none' | undefined {
            if (this.columnProp('sortable')) {
                const { sorted, sortOrder } = this.sortState;

                if (sorted && (sortOrder ?? 0) < 0) return 'descending';
                else if (sorted && (sortOrder ?? 0) > 0) return 'ascending';
                else return 'none';
            } else {
                return undefined;
            }
        }
    },
    components: {
        Badge,
        DTHeaderCheckbox: HeaderCheckbox,
        DTColumnFilter: ColumnFilter,
        SortAltIcon: SortAltIcon,
        SortAmountUpAltIcon: SortAmountUpAltIcon,
        SortAmountDownIcon: SortAmountDownIcon
    }
});
</script>
