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
import { getNextElementSibling, getOuterWidth, getPreviousElementSibling } from '../internal/utils/dom/index';
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
