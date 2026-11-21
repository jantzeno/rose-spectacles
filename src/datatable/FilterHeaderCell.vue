<template>
    <th
        v-if="!columnProp('hidden') && (rowGroupMode !== 'subheader' || groupRowsBy !== columnProp('field'))"
        :style="getFilterColumnHeaderStyle"
        :class="getFilterColumnHeaderClass"
        v-bind="{ ...getColumnPT('root'), ...getColumnPT('headerCell') }"
        :data-p-frozen-column="columnProp('frozen')"
    >
        <DTHeaderCheckbox
            v-if="columnProp('selectionMode') === 'multiple'"
            :checked="allRowsSelected"
            :disabled="empty"
            @change="$emit('checkbox-change', $event)"
            :column="column"
            :unstyled="unstyled"
            :pt="pt"
        />
        <DTColumnFilter
            v-if="columnSlots.filter"
            :field="columnProp('filterField') || columnProp('field')"
            :type="columnProp('dataType')"
            display="row"
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
    </th>
</template>

<script lang="ts">
import { getColumnPassThroughProps } from '../internal/column-pass-through';
import { observeFrozenColumn, updateFrozenColumnOffset } from '../internal/frozen-column-layout';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import { getVNodeProp } from '../core/utils/Utils';
import { defineComponent, mergeProps, type CSSProperties, type PropType, type Slots, type VNode } from 'vue';
import ColumnFilter from './ColumnFilter.vue';
import HeaderCheckbox from './HeaderCheckbox.vue';

export default defineComponent({
    name: 'FilterHeaderCell',
    hostName: 'DataTable',
    extends: BaseComponent,
    emits: ['checkbox-change', 'filter-change', 'filter-apply', 'operator-change', 'matchmode-change', 'constraint-add', 'constraint-remove', 'apply-click'],
    props: {
        column: {
            type: Object as PropType<VNode>,
            required: true
        },
        index: {
            type: Number,
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
        display: {
            type: String,
            default: 'row'
        },
        filters: {
            type: Object,
            default: null
        },
        filtersStore: {
            type: Object,
            default: null
        },
        rowGroupMode: {
            type: String,
            default: null
        },
        groupRowsBy: {
            type: [Array, String, Function],
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
            return getVNodeProp(this.column as VNode, prop);
        },
        getColumnPT(key: string) {
            if (!this.column) return null;

            const columnMetaData = {
                props: getColumnPassThroughProps(this.column as VNode),
                parent: {
                    instance: this,
                    props: this.$props,
                    state: this.$data
                },
                context: {
                    index: this.index
                }
            };

            return mergeProps(
                this.ptm(`column.${key}`, { column: columnMetaData }),
                this.ptm(`column.${key}`, columnMetaData),
                this.ptmo(this.getColumnProp(), key, columnMetaData)
            );
        },
        getColumnProp() {
            return this.column.props && this.column.props.pt ? this.column.props.pt : undefined; //@todo
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
        }
    },
    computed: {
        columnSlots(): Slots {
            return (this.column.children as Slots | null) ?? {};
        },
        getFilterColumnHeaderClass() {
            return [this.cx('headerCell', { column: this.column }), this.columnProp('filterHeaderClass'), this.columnProp('class')];
        },
        getFilterColumnHeaderStyle() {
            return this.columnProp('frozen')
                ? [this.columnProp('filterHeaderStyle'), this.columnProp('style'), this.styleObject]
                : [this.columnProp('filterHeaderStyle'), this.columnProp('style')];
        }
    },
    components: {
        DTHeaderCheckbox: HeaderCheckbox,
        DTColumnFilter: ColumnFilter
    }
});
</script>
