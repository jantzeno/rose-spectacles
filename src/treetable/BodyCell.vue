<template>
    <td
        :style="containerStyle"
        :class="containerClass"
        role="cell"
        v-bind="{ ...getColumnPT('root'), ...getColumnPT('bodyCell') }"
        :data-p-frozen-column="columnProp('frozen')"
    >
        <div :class="cx('bodyCellContent')" v-bind="getColumnPT('bodyCellContent')">
            <button
                v-if="columnProp('expander')"
                v-ripple
                type="button"
                :class="cx('nodeToggleButton')"
                @click="toggle"
                :style="togglerStyle"
                tabindex="-1"
                v-bind="getColumnPT('nodeToggleButton')"
                data-pc-group-section="rowactionbutton"
            >
                <template v-if="node.loading && loadingMode === 'icon'">
                    <component v-if="templates['nodetoggleicon']" :is="templates['nodetoggleicon']" />
                    <!-- TODO: Deprecated since v4.0-->
                    <component v-if="templates['nodetogglericon']" :is="templates['nodetogglericon']" />
                    <SpinnerIcon v-else spin v-bind="ptm('nodetoggleicon')" />
                </template>
                <template v-else>
                    <component
                        v-if="columnSlots.rowtoggleicon"
                        :is="columnSlots.rowtoggleicon"
                        :node="node"
                        :expanded="expanded"
                        :class="cx('nodeToggleIcon')"
                    />
                    <component
                        v-else-if="templates['nodetoggleicon']"
                        :is="templates['nodetoggleicon']"
                        :node="node"
                        :expanded="expanded"
                        :class="cx('nodeToggleIcon')"
                    />
                    <!-- TODO: Deprecated since v4.0-->
                    <component
                        v-else-if="columnSlots.rowtogglericon"
                        :is="columnSlots.rowtogglericon"
                        :node="node"
                        :expanded="expanded"
                        :class="cx('nodeToggleIcon')"
                    />
                    <component
                        v-else-if="expanded"
                        :is="node.expandedIcon ? 'span' : 'ChevronDownIcon'"
                        :class="cx('nodeToggleIcon')"
                        v-bind="getColumnPT('nodeToggleIcon')"
                    />
                    <component
                        v-else
                        :is="node.collapsedIcon ? 'span' : 'ChevronRightIcon'"
                        :class="cx('nodeToggleIcon')"
                        v-bind="getColumnPT('nodeToggleIcon')"
                    />
                </template>
            </button>
            <Checkbox
                v-if="checkboxSelectionMode && columnProp('expander')"
                :modelValue="checked"
                :binary="true"
                :class="cx('pcNodeCheckbox')"
                :disabled="node.selectable === false"
                @change="toggleCheckbox"
                :tabindex="-1"
                :indeterminate="partialChecked"
                :unstyled="unstyled"
                :pt="getColumnCheckboxPT('pcNodeCheckbox')"
                :data-p-partialchecked="partialChecked"
            >
                <template #icon="slotProps">
                    <component
                        v-if="templates['checkboxicon']"
                        :is="templates['checkboxicon']"
                        :checked="slotProps.checked"
                        :partialChecked="partialChecked"
                        :class="slotProps.class"
                    />
                </template>
            </Checkbox>
            <component v-if="columnSlots.body" :is="columnSlots.body" :node="node" :column="column" />
            <template v-else>{{ resolveFieldData(node.data, columnProp('field')) }}</template>
        </div>
    </td>
</template>

<script lang="ts">
import type { TreeNode } from 'rose-spectacles/treenode';
import { getColumnPassThroughProps } from '../internal/column-pass-through';
import { getNextElementSibling, getOuterWidth, getPreviousElementSibling } from '../internal/utils/dom/index';
import { resolveFieldData } from '../internal/utils/object/index';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import { getVNodeProp } from '../core/utils/Utils';
import CheckIcon from '../icons/check/CheckIcon.vue';
import ChevronDownIcon from '../icons/chevrondown/ChevronDownIcon.vue';
import ChevronRightIcon from '../icons/chevronright/ChevronRightIcon.vue';
import MinusIcon from '../icons/minus/MinusIcon.vue';
import SpinnerIcon from '../icons/spinner/SpinnerIcon.vue';
import Checkbox from '../checkbox/Checkbox.vue';
import Ripple from '../ripple/Ripple';
import { defineComponent, mergeProps, type CSSProperties, type PropType, type Slots, type VNode } from 'vue';

export default defineComponent({
    name: 'BodyCell',
    hostName: 'TreeTable',
    extends: BaseComponent,
    emits: ['node-toggle', 'checkbox-toggle'],
    props: {
        node: {
            type: Object as PropType<TreeNode>,
            required: true
        },
        column: {
            type: Object as PropType<VNode>,
            required: true
        },
        level: {
            type: Number,
            default: 0
        },
        indentation: {
            type: Number,
            default: 1
        },
        leaf: {
            type: Boolean,
            default: false
        },
        expanded: {
            type: Boolean,
            default: false
        },
        selectionMode: {
            type: String,
            default: null
        },
        checked: {
            type: Boolean,
            default: false
        },
        partialChecked: {
            type: Boolean,
            default: false
        },
        templates: {
            type: Object as PropType<Slots>,
            default: () => ({})
        },
        index: {
            type: Number,
            default: null
        },
        loadingMode: {
            type: String,
            default: 'mask'
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
        toggle() {
            this.$emit('node-toggle', this.node);
        },
        columnProp(prop: string) {
            return getVNodeProp(this.column, prop);
        },
        getColumnPT(key: string) {
            const table = (
                this as typeof this & {
                    $parentInstance?: { rowHover?: boolean; rowSelectionMode?: boolean; scrollable?: boolean; showGridlines?: boolean; size?: string };
                }
            ).$parentInstance;
            const row = this.$parent as { selected?: boolean } | null;
            const columnMetaData = {
                props: getColumnPassThroughProps(this.column),
                parent: {
                    instance: this,
                    props: this.$props,
                    state: this.$data
                },
                context: {
                    index: this.index,
                    selectable: table?.rowHover || table?.rowSelectionMode,
                    selected: row?.selected,
                    frozen: this.columnProp('frozen'),
                    scrollable: table?.scrollable,
                    showGridlines: table?.showGridlines,
                    size: table?.size,
                    node: this.node
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
        getColumnCheckboxPT(key: string) {
            const columnMetaData = {
                props: getColumnPassThroughProps(this.column),
                parent: {
                    instance: this,
                    props: this.$props,
                    state: this.$data
                },
                context: {
                    checked: this.checked,
                    partialChecked: this.partialChecked,
                    node: this.node
                }
            };

            return mergeProps(
                this.ptm(`column.${key}`, { column: columnMetaData }),
                this.ptm(`column.${key}`, columnMetaData),
                this.ptmo(this.getColumnProp(), key, columnMetaData)
            );
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
        },
        resolveFieldData(rowData: unknown, field: unknown) {
            return resolveFieldData(rowData, field);
        },
        toggleCheckbox() {
            this.$emit('checkbox-toggle');
        }
    },
    computed: {
        columnSlots(): Slots {
            return (this.column.children as Slots | null) ?? {};
        },
        containerClass() {
            return [this.columnProp('bodyClass'), this.columnProp('class'), this.cx('bodyCell')];
        },
        containerStyle() {
            let bodyStyle = this.columnProp('bodyStyle');
            let columnStyle = this.columnProp('style');

            return this.columnProp('frozen') ? [columnStyle, bodyStyle, this.styleObject] : [columnStyle, bodyStyle];
        },
        togglerStyle(): CSSProperties {
            return {
                marginLeft: this.level * this.indentation + 'rem',
                visibility: this.leaf ? 'hidden' : 'visible'
            };
        },
        checkboxSelectionMode() {
            return this.selectionMode === 'checkbox';
        }
    },
    components: {
        Checkbox,
        ChevronRightIcon,
        ChevronDownIcon,
        CheckIcon,
        MinusIcon,
        SpinnerIcon
    },
    directives: {
        ripple: Ripple
    }
});
</script>
