<template>
    <td
        :style="containerStyle"
        :class="containerClass"
        role="cell"
        :colspan="columnProp('colspan')"
        :rowspan="columnProp('rowspan')"
        v-bind="{ ...getColumnPT('root'), ...getColumnPT('footerCell') }"
        :data-p-frozen-column="columnProp('frozen')"
    >
        <component v-if="column.children && column.children.footer" :is="column.children.footer" :column="column" />
        <span v-if="columnProp('footer')" :class="cx('columnFooter')" v-bind="getColumnPT('columnFooter')">{{ columnProp('footer') }}</span>
    </td>
</template>

<script lang="ts">
import { getColumnPassThroughProps } from '../internal/column-pass-through';
import { observeFrozenColumn, updateFrozenColumnOffset } from '../internal/frozen-column-layout';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import { getVNodeProp } from '../core/utils/Utils';
import { defineComponent, mergeProps, type CSSProperties, type VNode } from 'vue';

export default defineComponent({
    name: 'FooterCell',
    hostName: 'DataTable',
    extends: BaseComponent,
    props: {
        column: {
            type: Object,
            default: null
        },
        index: {
            type: Number,
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
            const { $parentInstance: parent } = this as typeof this & { $parentInstance?: { $parentInstance?: { size?: string; showGridlines?: boolean } } };
            const table = parent?.$parentInstance;
            const columnMetaData = {
                props: getColumnPassThroughProps(this.column as VNode),
                parent: {
                    instance: this,
                    props: this.$props,
                    state: this.$data
                },
                context: {
                    index: this.index,
                    size: table?.size,
                    showGridlines: table?.showGridlines || false
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
        containerClass() {
            return [this.columnProp('footerClass'), this.columnProp('class'), this.cx('footerCell')];
        },
        containerStyle() {
            let bodyStyle = this.columnProp('footerStyle');
            let columnStyle = this.columnProp('style');

            return this.columnProp('frozen') ? [columnStyle, bodyStyle, this.styleObject] : [columnStyle, bodyStyle];
        }
    }
});
</script>
