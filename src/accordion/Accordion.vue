<template>
    <div :class="cx('root')" v-bind="ptmi('root')">
        <template v-if="hasAccordionTab">
            <AccordionPanel
                v-for="(tab, i) of tabs"
                :key="getKey(tab, i)"
                :value="`${i}`"
                :pt="{ root: getTabPT(tab, 'root', i) }"
                :disabled="getTabProp(tab, 'disabled')"
            >
                <AccordionHeader :class="getTabProp(tab, 'headerClass')" :pt="getHeaderPT(tab, i)">
                    <component
                        v-if="tab.children && tab.children.headericon"
                        :is="tab.children.headericon"
                        :isTabActive="isItemActive(`${i}`)"
                        :active="isItemActive(`${i}`)"
                        :index="i"
                    ></component>
                    <span v-if="tab.props && tab.props.header" v-bind="getTabPT(tab, 'headertitle', i)">{{ tab.props.header }}</span>
                    <template #toggleicon="slotProps">
                        <component
                            v-if="slotProps.active"
                            :is="$slots.collapseicon ? $slots.collapseicon : collapseIcon ? 'span' : 'ChevronDownIcon'"
                            :class="[collapseIcon, slotProps.class]"
                            aria-hidden="true"
                            v-bind="getTabPT(tab, 'headericon', i)"
                        />
                        <component
                            v-else
                            :is="$slots.expandicon ? $slots.expandicon : expandIcon ? 'span' : 'ChevronUpIcon'"
                            :class="[expandIcon, slotProps.class]"
                            aria-hidden="true"
                            v-bind="getTabPT(tab, 'headericon', i)"
                        />
                    </template>
                    <component v-if="tab.children && tab.children.header" :is="tab.children.header"></component>
                </AccordionHeader>
                <AccordionContent :pt="getContentPT(tab, i)">
                    <component :is="tab"></component>
                </AccordionContent>
            </AccordionPanel>
        </template>

        <slot v-else></slot>
    </div>
</template>

<script lang="ts">
import ChevronRightIcon from '../icons/chevronright/ChevronRightIcon.vue';
import ChevronUpIcon from '../icons/chevronup/ChevronUpIcon.vue';
import AccordionContent from '../accordioncontent/AccordionContent.vue';
import AccordionHeader from '../accordionheader/AccordionHeader.vue';
import AccordionPanel from '../accordionpanel/AccordionPanel.vue';
import { defineComponent, isVNode, mergeProps, type Slots, type VNode, type VNodeChild } from 'vue';
import BaseAccordion from './BaseAccordion.vue';
import type { AccordionKey } from './context';

type AccordionValue = AccordionKey | AccordionKey[] | null | undefined;
type AccordionTabNode = VNode & { children: Slots | null };

export default defineComponent({
    name: 'Accordion',
    extends: BaseAccordion,
    inheritAttrs: false,
    emits: ['update:value', 'update:activeIndex', 'tab-open', 'tab-close', 'tab-click'],
    data() {
        return {
            d_value: this.value as AccordionValue
        };
    },
    watch: {
        value(newValue) {
            this.d_value = newValue;
        },
        activeIndex: {
            immediate: true,
            handler(newValue) {
                if (this.hasAccordionTab) {
                    this.d_value = this.multiple ? (newValue as number[] | null)?.map(String) : newValue?.toString();
                }
            }
        }
    },
    methods: {
        isItemActive(value?: AccordionKey) {
            return this.multiple ? (this.d_value as AccordionKey[] | null | undefined)?.includes(value!) : this.d_value === value;
        },
        updateValue(newValue?: AccordionKey) {
            const active = this.isItemActive(newValue);

            if (this.multiple) {
                const current = this.d_value as AccordionKey[] | null | undefined;

                if (active) {
                    this.d_value = current!.filter((v) => v !== newValue);
                } else {
                    if (current) current.push(newValue!);
                    else this.d_value = [newValue!];
                }
            } else {
                this.d_value = active ? null : newValue;
            }

            this.$emit('update:value', this.d_value);

            // @deprecated since v4.
            this.$emit('update:activeIndex', this.multiple ? (this.d_value as AccordionKey[] | null | undefined)?.map(Number) : Number(this.d_value));
            this.$emit(active ? 'tab-close' : 'tab-open', { originalEvent: undefined, index: Number(newValue) });
        },
        // @deprecated since v4. Use new structure instead.
        isAccordionTab(child: VNodeChild): child is AccordionTabNode {
            return isVNode(child) && (child.type as { name?: string }).name === 'AccordionTab';
        },
        getTabProp(tab: AccordionTabNode, name: string) {
            return tab.props ? tab.props[name] : undefined;
        },
        getKey(tab: AccordionTabNode, index: number) {
            return this.getTabProp(tab, 'header') || index;
        },
        getHeaderPT(tab: AccordionTabNode, index: number) {
            return {
                root: mergeProps(
                    { onClick: (event: MouseEvent) => this.onTabClick(event, index) },
                    this.getTabProp(tab, 'headerProps'),
                    this.getTabPT(tab, 'header', index)
                ),
                toggleicon: mergeProps(this.getTabProp(tab, 'headeractionprops'), this.getTabPT(tab, 'headeraction', index))
            };
        },
        getContentPT(tab: AccordionTabNode, index: number) {
            return {
                root: mergeProps(this.getTabProp(tab, 'contentProps'), this.getTabPT(tab, 'toggleablecontent', index)),
                transition: this.getTabPT(tab, 'transition', index),
                content: this.getTabPT(tab, 'content', index)
            };
        },
        getTabPT(tab: AccordionTabNode, key: string, index: number) {
            const count = this.tabs.length;
            const tabMetaData = {
                props: tab.props || {},
                parent: {
                    instance: this,
                    props: this.$props,
                    state: this.$data
                },
                context: {
                    index,
                    count,
                    first: index === 0,
                    last: index === count - 1,
                    active: this.isItemActive(`${index}`)
                }
            };

            return mergeProps(this.ptm(`accordiontab.${key}`, tabMetaData), this.ptmo(this.getTabProp(tab, 'pt'), key, tabMetaData));
        },
        onTabClick(event: MouseEvent, index: number) {
            this.$emit('tab-click', { originalEvent: event, index });
        }
    },
    computed: {
        // @deprecated since v4.
        tabs() {
            return this.$slots.default!().reduce<AccordionTabNode[]>((tabs, child) => {
                if (this.isAccordionTab(child)) {
                    tabs.push(child);
                } else if (child.children && child.children instanceof Array) {
                    child.children.forEach((nestedChild) => {
                        if (this.isAccordionTab(nestedChild)) {
                            tabs.push(nestedChild);
                        }
                    });
                }

                return tabs;
            }, []);
        },
        hasAccordionTab() {
            return this.tabs.length;
        }
    },
    components: {
        AccordionPanel,
        AccordionHeader,
        AccordionContent,
        ChevronUpIcon,
        ChevronRightIcon
    }
});
</script>
