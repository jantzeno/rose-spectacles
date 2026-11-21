<template>
    <th
        v-if="!columnProp('hidden')"
        :style="getFilterColumnHeaderStyle"
        :class="getFilterColumnHeaderClass"
        v-bind="{ ...getColumnPT('root'), ...getColumnPT('headerCell') }"
        :data-p-frozen-column="columnProp('frozen')"
    >
        <TTColumnFilter
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
import { getNextElementSibling, getOuterWidth, getPreviousElementSibling } from '../internal/utils/dom/index';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import { getVNodeProp } from '../core/utils/Utils';
import { defineComponent, mergeProps, type CSSProperties, type PropType, type Slots, type VNode } from 'vue';
import ColumnFilter from './ColumnFilter.vue';

export default defineComponent({
    name: 'FilterHeaderCell',
    hostName: 'TreeTable',
    extends: BaseComponent,
    emits: ['filter-change', 'filter-apply', 'operator-change', 'matchmode-change', 'constraint-add', 'constraint-remove', 'apply-click'],
    props: {
        column: {
            type: Object as PropType<VNode>,
            default: null
        },
        index: {
            type: Number,
            default: null
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
            if (!this.column) return null;

            const columnMetaData = {
                props: getColumnPassThroughProps(this.column),
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
            return this.column.props && this.column.props.pt ? this.column.props.pt : undefined;
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
            }
        }
    },
    computed: {
        columnSlots(): Slots {
            return (this.column.children as Slots | null) ?? {};
        },
        getFilterColumnHeaderClass() {
            return [this.cx('headerCell', { filterCell: true }), this.columnProp('filterHeaderClass'), this.columnProp('class')];
        },
        getFilterColumnHeaderStyle() {
            return this.columnProp('frozen')
                ? [this.columnProp('filterHeaderStyle'), this.columnProp('style'), this.styleObject]
                : [this.columnProp('filterHeaderStyle'), this.columnProp('style')];
        }
    },
    components: {
        TTColumnFilter: ColumnFilter
    }
});
</script>
