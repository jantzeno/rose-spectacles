<template>
    <tfoot
        v-if="hasFooter"
        :class="cx('tfoot')"
        :style="sx('tfoot')"
        role="rowgroup"
        v-bind="columnGroup ? { ...ptm('tfoot', ptmTFootOptions), ...getColumnGroupPT('root') } : ptm('tfoot', ptmTFootOptions)"
        :data-p-scrollable="ptmTFootOptions.context.scrollable"
        data-pc-section="tfoot"
    >
        <tr v-if="!columnGroup" role="row" v-bind="ptm('footerRow')">
            <template v-for="(col, i) of columns" :key="columnProp(col, 'columnKey') || columnProp(col, 'field') || i">
                <DTFooterCell v-if="!columnProp(col, 'hidden')" :column="col" :pt="pt" />
            </template>
        </tr>
        <template v-else>
            <tr v-for="({ row, cells }, i) of groupedFooterRows" :key="i" role="row" v-bind="{ ...ptm('footerRow'), ...getRowPT(row, 'root', i) }">
                <template v-for="{ column: col, start } of cells" :key="columnProp(col, 'columnKey') || columnProp(col, 'field') || start">
                    <DTFooterCell :column="col" :index="i" :pt="pt" />
                </template>
            </tr>
        </template>
    </tfoot>
</template>

<script lang="ts">
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import { HelperSet, getVNodeProp } from '../core/utils/Utils';
import { defineComponent, mergeProps, type PropType, type VNode } from 'vue';
import FooterCell from './FooterCell.vue';
import { getColumnGroupLayout, projectColumnGroupLayout } from './column-group-layout';

export default defineComponent({
    name: 'TableFooter',
    hostName: 'DataTable',
    extends: BaseComponent,
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
            type: Object as PropType<VNode[]>,
            default: null
        }
    },
    provide() {
        return {
            $rows: this.d_footerRows,
            $columns: this.d_footerColumns
        };
    },
    data() {
        return {
            d_footerRows: new HelperSet({ type: 'Row' }),
            d_footerColumns: new HelperSet({ type: 'Column' })
        };
    },
    beforeUnmount() {
        this.d_footerRows.clear();
        this.d_footerColumns.clear();
    },
    methods: {
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
                    type: 'footer',
                    scrollable: this.ptmTFootOptions.context.scrollable
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
        getFooterColumns(row: VNode) {
            return this.d_footerColumns.get(row, row.children) ?? [];
        }
    },
    computed: {
        footerRows() {
            return this.columnGroup ? (this.d_footerRows.get(this.columnGroup, this.columnGroup.children) ?? []) : [];
        },
        columnGroupLayout() {
            return getColumnGroupLayout(this.footerRows.map((row) => this.getFooterColumns(row).filter((column) => !this.columnProp(column, 'hidden'))));
        },
        groupedFooterRows() {
            const layout = projectColumnGroupLayout(this.columnGroupLayout, this.columnOrder) ?? this.columnGroupLayout;

            return this.footerRows.map((row, index) => ({ row, cells: layout[index] }));
        },
        hasFooter() {
            let hasFooter = false;

            if (this.columnGroup) {
                hasFooter = true;
            } else if (this.columns) {
                for (let col of this.columns) {
                    const children = col.children;

                    if (this.columnProp(col, 'footer') || (children && typeof children === 'object' && 'footer' in children && children.footer)) {
                        hasFooter = true;
                        break;
                    }
                }
            }

            return hasFooter;
        },
        ptmTFootOptions() {
            const { $parentInstance: parent } = this as typeof this & { $parentInstance?: { $parentInstance?: { scrollable?: boolean } } };

            return {
                context: {
                    scrollable: parent?.$parentInstance?.scrollable
                }
            };
        }
    },
    components: {
        DTFooterCell: FooterCell
    }
});
</script>
