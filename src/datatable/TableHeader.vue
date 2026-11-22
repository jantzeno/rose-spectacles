<template>
    <thead
        :class="cx('thead')"
        :style="sx('thead')"
        role="rowgroup"
        v-bind="columnGroup ? { ...ptm('thead', ptmTHeadOptions), ...getColumnGroupPT('root') } : ptm('thead', ptmTHeadOptions)"
        :data-p-scrollable="ptmTHeadOptions.context.scrollable"
        :data-p-column-group="columnGroup ? true : undefined"
        data-pc-section="thead"
    >
        <template v-if="!columnGroup">
            <tr role="row" v-bind="ptm('headerRow')">
                <template v-for="(col, i) of columns" :key="columnKeys[i] ?? i">
                    <DTHeaderCell
                        v-if="isColumnVisible(col)"
                        :column="col"
                        :index="i"
                        @column-click="$emit('column-click', $event)"
                        @column-mousedown="$emit('column-mousedown', $event)"
                        @column-dragstart="$emit('column-dragstart', $event, columnKeys[i])"
                        @column-dragover="$emit('column-dragover', $event)"
                        @column-dragleave="$emit('column-dragleave', $event)"
                        @column-drop="$emit('column-drop', $event, columnKeys[i])"
                        @dragend="$emit('column-dragend')"
                        :groupRowsBy="groupRowsBy"
                        :groupRowSortField="groupRowSortField"
                        :reorderableColumns="reorderableColumns"
                        :resizableColumns="resizableColumns"
                        @column-resizestart="$emit('column-resizestart', $event)"
                        :sortMode="sortMode"
                        :sortField="sortField"
                        :sortOrder="sortOrder"
                        :multiSortMeta="multiSortMeta"
                        :allRowsSelected="allRowsSelected"
                        :empty="empty"
                        @checkbox-change="$emit('checkbox-change', $event)"
                        :filters="filters"
                        :filterDisplay="filterDisplay"
                        :filtersStore="filtersStore"
                        :filterInputProps="filterInputProps"
                        :filterButtonProps="filterButtonProps"
                        :first="first"
                        @filter-change="$emit('filter-change', $event)"
                        @filter-apply="$emit('filter-apply')"
                        @operator-change="$emit('operator-change', $event)"
                        @matchmode-change="$emit('matchmode-change', $event)"
                        @constraint-add="$emit('constraint-add', $event)"
                        @constraint-remove="$emit('constraint-remove', $event)"
                        @apply-click="$emit('apply-click', $event)"
                        :unstyled="unstyled"
                        :pt="pt"
                    />
                </template>
            </tr>
        </template>
        <template v-else>
            <tr v-for="({ row, cells }, i) of groupedHeaderRows" :key="i" role="row" v-bind="{ ...ptm('headerRow'), ...getRowPT(row, 'root', i) }">
                <template v-for="{ column: col, start, end } of cells" :key="columnProp(col, 'columnKey') || columnProp(col, 'field') || start">
                    <DTHeaderCell
                        :column="col"
                        :index="start"
                        :data-p-column-start="start"
                        :data-p-column-end="end"
                        :reorderableColumns="reorderableColumns"
                        :resizableColumns="resizableColumns && end <= visibleColumnCount && (columnResizeMode !== 'fit' || end < visibleColumnCount)"
                        @column-click="$emit('column-click', $event)"
                        @column-mousedown="$emit('column-mousedown', $event)"
                        @column-dragstart="$emit('column-dragstart', $event)"
                        @column-dragover="$emit('column-dragover', $event)"
                        @column-dragleave="$emit('column-dragleave', $event)"
                        @column-drop="$emit('column-drop', $event)"
                        @dragend="$emit('column-dragend')"
                        @column-resizestart="$emit('column-resizestart', $event, end - 1)"
                        :groupRowsBy="groupRowsBy"
                        :groupRowSortField="groupRowSortField"
                        :sortMode="sortMode"
                        :sortField="sortField"
                        :sortOrder="sortOrder"
                        :multiSortMeta="multiSortMeta"
                        :allRowsSelected="allRowsSelected"
                        :empty="empty"
                        @checkbox-change="$emit('checkbox-change', $event)"
                        :filters="filters"
                        :filterDisplay="filterDisplay"
                        :filtersStore="filtersStore"
                        :filterInputProps="filterInputProps"
                        :filterButtonProps="filterButtonProps"
                        @filter-change="$emit('filter-change', $event)"
                        @filter-apply="$emit('filter-apply')"
                        @operator-change="$emit('operator-change', $event)"
                        @matchmode-change="$emit('matchmode-change', $event)"
                        @constraint-add="$emit('constraint-add', $event)"
                        @constraint-remove="$emit('constraint-remove', $event)"
                        @apply-click="$emit('apply-click', $event)"
                        :unstyled="unstyled"
                        :pt="pt"
                    />
                </template>
            </tr>
        </template>
        <tr v-if="filterDisplay === 'row'" role="row" v-bind="ptm('headerRow')">
            <template v-for="(col, i) of columns" :key="columnKeys[i] ?? i">
                <DTFilterHeaderCell
                    v-if="isColumnVisible(col)"
                    :column="col"
                    :index="i"
                    :allRowsSelected="allRowsSelected"
                    :empty="empty"
                    display="row"
                    :filters="filters"
                    :filtersStore="filtersStore"
                    :filterInputProps="filterInputProps"
                    :filterButtonProps="filterButtonProps"
                    @filter-change="$emit('filter-change', $event)"
                    @filter-apply="$emit('filter-apply')"
                    @operator-change="$emit('operator-change', $event)"
                    @matchmode-change="$emit('matchmode-change', $event)"
                    @constraint-add="$emit('constraint-add', $event)"
                    @constraint-remove="$emit('constraint-remove', $event)"
                    @apply-click="$emit('apply-click', $event)"
                    @checkbox-change="$emit('checkbox-change', $event)"
                    :unstyled="unstyled"
                    :pt="pt"
                />
            </template>
        </tr>
    </thead>
</template>

<script lang="ts">
import type { TableSortMeta } from './BaseDataTable.vue';
import { getColumnPassThroughProps } from '../internal/column-pass-through';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import { HelperSet, getVNodeProp } from '../core/utils/Utils';
import { defineComponent, mergeProps, type PropType, type VNode } from 'vue';
import FilterHeaderCell from './FilterHeaderCell.vue';
import HeaderCell from './HeaderCell.vue';
import { getColumnGroupLayout, projectColumnGroupLayout } from './column-group-layout';
import { isRowGroupField, type RowGroupFields } from './row-groups';

export default defineComponent({
    name: 'TableHeader',
    hostName: 'DataTable',
    extends: BaseComponent,
    emits: [
        'column-click',
        'column-mousedown',
        'column-dragstart',
        'column-dragover',
        'column-dragleave',
        'column-dragend',
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
        columnGroup: {
            type: null as unknown as PropType<VNode>,
            default: null
        },
        columnOrder: {
            type: Array as PropType<number[] | null>,
            default: null
        },
        columns: {
            type: null as unknown as PropType<VNode[]>,
            default: null
        },
        columnKeys: {
            type: Array as PropType<VNode['key'][]>,
            default: () => []
        },
        rowGroupMode: {
            type: String,
            default: null
        },
        groupRowsBy: {
            type: [Array, String, Function] as PropType<RowGroupFields>,
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
        allRowsSelected: {
            type: Boolean,
            default: false
        },
        empty: {
            type: Boolean,
            default: false
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
        reorderableColumns: {
            type: Boolean,
            default: false
        },
        first: {
            type: Number,
            default: 0
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
    provide() {
        return {
            $rows: this.d_headerRows,
            $columns: this.d_headerColumns
        };
    },
    data() {
        return {
            d_headerRows: new HelperSet({ type: 'Row' }),
            d_headerColumns: new HelperSet({ type: 'Column' })
        };
    },
    beforeUnmount() {
        this.d_headerRows.clear();
        this.d_headerColumns.clear();
    },
    methods: {
        isColumnVisible(column: VNode) {
            return (
                !this.columnProp(column, 'hidden') &&
                (this.rowGroupMode !== 'subheader' || !isRowGroupField(this.groupRowsBy, this.columnProp(column, 'field')))
            );
        },
        columnProp(col: VNode, prop: string) {
            return getVNodeProp(col, prop);
        },
        getColumnGroupPT(key: string) {
            const columnGroupMetaData = {
                props: this.getColumnGroupProps(),
                parent: {
                    instance: this,
                    props: this.$props,
                    state: this.$data
                },
                context: {
                    type: 'header',
                    scrollable: this.ptmTHeadOptions.context.scrollable
                }
            };

            return mergeProps(
                this.ptm(`columnGroup.${key}`, { columnGroup: columnGroupMetaData }),
                this.ptm(`columnGroup.${key}`, columnGroupMetaData),
                this.ptmo(this.getColumnGroupProps(), key, columnGroupMetaData)
            );
        },
        getColumnGroupProps() {
            return this.columnGroup && this.columnGroup.props && this.columnGroup.props.pt ? this.columnGroup.props.pt : undefined; //@todo
        },
        getRowPT(row: VNode, key: string, index: number) {
            const rowMetaData = {
                props: row.props,
                parent: {
                    instance: this,
                    props: this.$props,
                    state: this.$data
                },
                context: {
                    index
                }
            };

            return mergeProps(
                this.ptm(`row.${key}`, { row: rowMetaData }),
                this.ptm(`row.${key}`, rowMetaData),
                this.ptmo(this.getRowProp(row), key, rowMetaData)
            );
        },
        getRowProp(row: VNode) {
            return row.props && row.props.pt ? row.props.pt : undefined; //@todo
        },
        getColumnPT(column: VNode, key: string, index: number) {
            const columnMetaData = {
                props: getColumnPassThroughProps(column),
                parent: {
                    instance: this,
                    props: this.$props,
                    state: this.$data
                },
                context: {
                    index
                }
            };

            return mergeProps(
                this.ptm(`column.${key}`, { column: columnMetaData }),
                this.ptm(`column.${key}`, columnMetaData),
                this.ptmo(this.getColumnProp(column), key, columnMetaData)
            );
        },
        getColumnProp(column: VNode) {
            return column.props && column.props.pt ? column.props.pt : undefined; //@todo
        },
        getFilterColumnHeaderClass(column: VNode) {
            return [this.cx('headerCell', { column }), this.columnProp(column, 'filterHeaderClass'), this.columnProp(column, 'class')];
        },
        getFilterColumnHeaderStyle(column: VNode) {
            return [this.columnProp(column, 'filterHeaderStyle'), this.columnProp(column, 'style')];
        },
        getHeaderColumns(row: VNode) {
            return this.d_headerColumns.get(row, row.children) ?? [];
        }
    },
    computed: {
        headerRows() {
            return this.columnGroup ? (this.d_headerRows.get(this.columnGroup, this.columnGroup.children) ?? []) : [];
        },
        visibleColumnCount() {
            return this.columns?.filter(this.isColumnVisible).length ?? 0;
        },
        columnGroupLayout() {
            return getColumnGroupLayout(
                this.headerRows.map((row) => this.getHeaderColumns(row).filter((column) => this.isColumnVisible(column) && typeof column.children !== 'string'))
            );
        },
        groupedHeaderRows() {
            const layout = projectColumnGroupLayout(this.columnGroupLayout, this.columnOrder) ?? this.columnGroupLayout;

            return this.headerRows.map((row, index) => ({ row, cells: layout[index] }));
        },
        ptmTHeadOptions() {
            const { $parentInstance: parent } = this as typeof this & { $parentInstance?: { $parentInstance?: { scrollable?: boolean } } };

            return {
                context: {
                    scrollable: parent?.$parentInstance?.scrollable
                }
            };
        }
    },
    components: {
        DTHeaderCell: HeaderCell,
        DTFilterHeaderCell: FilterHeaderCell
    }
});
</script>
