<template>
    <th
        :class="containerClass"
        :style="[containerStyle]"
        @click="onClick"
        @keydown="onKeyDown"
        :tabindex="columnProp('sortable') ? '0' : undefined"
        :aria-sort="ariaSort"
        role="columnheader"
        v-bind="{ ...getColumnPT('root'), ...getColumnPT('headerCell') }"
        :data-p-sortable-column="columnProp('sortable')"
        :data-p-resizable-column="resizableColumns"
        :data-p-sorted="isColumnSorted()"
        :data-p-frozen-column="columnProp('frozen')"
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
                    v-bind="getColumnPT('sortIcon')"
                />
            </span>
            <Badge v-if="isMultiSorted()" :class="cx('pcSortBadge')" v-bind="getColumnPT('pcSortBadge')" :value="getMultiSortMetaIndex() + 1" size="small" />
            <TTColumnFilter
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
import type { TreeTableSortMeta } from 'rose-spectacles/treetable';
import { getColumnPassThroughProps } from '../internal/column-pass-through';
import { getAttribute, getIndex, getNextElementSibling, getOuterWidth, getPreviousElementSibling } from '../internal/utils/dom/index';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import { getVNodeProp } from '../core/utils/Utils';
import SortAltIcon from '../icons/sortalt/SortAltIcon.vue';
import SortAmountDownIcon from '../icons/sortamountdown/SortAmountDownIcon.vue';
import SortAmountUpAltIcon from '../icons/sortamountupalt/SortAmountUpAltIcon.vue';
import Badge from '../badge/Badge.vue';
import { defineComponent, mergeProps, type CSSProperties, type PropType, type Slots, type VNode } from 'vue';
import ColumnFilter from './ColumnFilter.vue';

export default defineComponent({
    name: 'HeaderCell',
    hostName: 'TreeTable',
    extends: BaseComponent,
    emits: [
        'column-click',
        'column-resizestart',
        'filter-change',
        'filter-apply',
        'operator-change',
        'matchmode-change',
        'constraint-add',
        'constraint-remove',
        'apply-click'
    ],
    props: {
        column: {
            type: Object as PropType<VNode>,
            required: true
        },
        resizableColumns: {
            type: Boolean,
            default: false
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
            type: Array as PropType<TreeTableSortMeta[]>,
            default: null
        },
        sortMode: {
            type: String,
            default: 'single'
        },
        index: {
            type: Number,
            default: null
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
            styleObject: {} as CSSProperties
        };
    },
    mounted() {
        if (this.columnProp('frozen')) {
            this.updateStickyPosition();
        }
    },
    updated() {
        if (this.columnProp('frozen')) {
            this.updateStickyPosition();
        }
    },
    methods: {
        columnProp(prop: string) {
            return getVNodeProp(this.column, prop);
        },
        getColumnPT(key: string) {
            const { $parentInstance: table } = this as typeof this & { $parentInstance?: { scrollable?: boolean; showGridlines?: boolean; size?: string } };
            const columnMetaData = {
                props: getColumnPassThroughProps(this.column),
                parent: {
                    instance: this,
                    props: this.$props,
                    state: this.$data
                },
                context: {
                    index: this.index,
                    sorted: this.isColumnSorted(),
                    frozen: table?.scrollable && this.columnProp('frozen'),
                    resizable: this.resizableColumns,
                    scrollable: table?.scrollable,
                    showGridlines: table?.showGridlines,
                    size: table?.size
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
        updateStickyPosition() {
            if (this.columnProp('frozen')) {
                let align = this.columnProp('alignFrozen');

                if (align === 'right') {
                    let pos = 0;
                    let next = getNextElementSibling(this.$el, '[data-p-frozen-column="true"]');

                    if (next) {
                        pos = getOuterWidth(next) + parseFloat((next as HTMLElement).style.insetInlineEnd || '0');
                    }

                    this.styleObject.insetInlineEnd = pos + 'px';
                } else {
                    let pos = 0;
                    let prev = getPreviousElementSibling(this.$el, '[data-p-frozen-column="true"]');

                    if (prev) {
                        pos = getOuterWidth(prev) + parseFloat((prev as HTMLElement).style.insetInlineStart || '0');
                    }

                    this.styleObject.insetInlineStart = pos + 'px';
                }

                const filterRow = (this.$el as HTMLElement).parentElement?.nextElementSibling;
                const filterCell = filterRow?.children[getIndex(this.$el)];

                if (filterCell instanceof HTMLElement && filterCell.getAttribute('data-p-frozen-column') === 'true') {
                    if (this.styleObject.insetInlineStart) filterCell.style.insetInlineStart = String(this.styleObject.insetInlineStart);
                    if (this.styleObject.insetInlineEnd) filterCell.style.insetInlineEnd = String(this.styleObject.insetInlineEnd);
                }
            }
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
        onResizeStart(event: MouseEvent) {
            this.$emit('column-resizestart', event);
        },
        getMultiSortMetaIndex() {
            return this.multiSortMeta?.findIndex((meta) => meta.field === this.columnProp('field') || meta.field === this.columnProp('sortField')) ?? -1;
        },
        isMultiSorted() {
            return this.columnProp('sortable') && this.getMultiSortMetaIndex() > -1;
        },
        isColumnSorted() {
            return this.sortMode === 'single'
                ? this.sortField && (this.sortField === this.columnProp('field') || this.sortField === this.columnProp('sortField'))
                : this.isMultiSorted();
        }
    },
    computed: {
        columnSlots(): Slots {
            return (this.column.children as Slots | null) ?? {};
        },
        containerClass() {
            return [this.columnProp('headerClass'), this.columnProp('class'), this.cx('headerCell')];
        },
        containerStyle() {
            let headerStyle = this.columnProp('headerStyle');
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
        TTColumnFilter: ColumnFilter,
        SortAltIcon: SortAltIcon,
        SortAmountUpAltIcon: SortAmountUpAltIcon,
        SortAmountDownIcon: SortAmountDownIcon
    }
});
</script>
