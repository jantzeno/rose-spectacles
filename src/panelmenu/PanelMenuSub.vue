<template>
    <ul :class="cx('submenu')" :tabindex="tabindex">
        <template v-for="(processedItem, index) of items" :key="getItemKey(processedItem)">
            <li
                v-if="isItemVisible(processedItem) && !getItemProp(processedItem, 'separator')"
                :id="getItemId(processedItem)"
                :class="[cx('item', { processedItem }), getItemProp(processedItem, 'class')]"
                :style="getItemProp(processedItem, 'style')"
                role="treeitem"
                :aria-label="getItemLabel(processedItem)"
                :aria-expanded="isItemGroup(processedItem) ? isItemActive(processedItem) : undefined"
                :aria-level="level + 1"
                :aria-setsize="getAriaSetSize()"
                :aria-posinset="getAriaPosInset(index)"
                v-bind="getPTOptions('item', processedItem, index)"
                :data-p-focused="isItemFocused(processedItem)"
                :data-p-disabled="isItemDisabled(processedItem)"
            >
                <div
                    :class="cx('itemContent')"
                    @click="onItemClick($event, processedItem)"
                    @mousemove="onItemMouseMove($event, processedItem)"
                    v-bind="getPTOptions('itemContent', processedItem, index)"
                >
                    <template v-if="!templates.item">
                        <a
                            v-ripple
                            :href="menuItemHref(getItemProp(processedItem, 'url'))"
                            :class="cx('itemLink')"
                            :target="getItemProp(processedItem, 'target')"
                            tabindex="-1"
                            v-bind="getPTOptions('itemLink', processedItem, index)"
                        >
                            <template v-if="isItemGroup(processedItem)">
                                <component
                                    v-if="templates.submenuicon"
                                    :is="templates.submenuicon"
                                    :class="cx('submenuIcon')"
                                    :active="isItemActive(processedItem)"
                                    v-bind="getPTOptions('submenuIcon', processedItem, index)"
                                />
                                <component
                                    v-else
                                    :is="isItemActive(processedItem) ? 'ChevronDownIcon' : 'ChevronRightIcon'"
                                    :class="cx('submenuIcon')"
                                    v-bind="getPTOptions('submenuIcon', processedItem, index)"
                                />
                            </template>
                            <component v-if="templates.itemicon" :is="templates.itemicon" :item="processedItem.item" :class="cx('itemIcon')" />
                            <span
                                v-else-if="getItemProp(processedItem, 'icon')"
                                :class="[cx('itemIcon'), getItemProp(processedItem, 'icon')]"
                                v-bind="getPTOptions('itemIcon', processedItem, index)"
                            />
                            <span :class="cx('itemLabel')" v-bind="getPTOptions('itemLabel', processedItem, index)">{{ getItemLabel(processedItem) }}</span>
                        </a>
                    </template>
                    <component
                        v-else
                        :is="templates.item"
                        :item="processedItem.item"
                        :root="false"
                        :active="isItemActive(processedItem)"
                        :hasSubmenu="isItemGroup(processedItem)"
                        :label="getItemLabel(processedItem)"
                        :props="getMenuItemProps(processedItem, index)"
                    ></component>
                </div>
                <transition name="rs-collapsible" v-bind="ptm('transition')">
                    <div v-show="isItemActive(processedItem)" :class="cx('contentContainer')" v-bind="ptm('contentContainer')">
                        <div :class="cx('contentWrapper')" v-bind="ptm('contentWrapper')">
                            <PanelMenuSub
                                v-if="isItemVisible(processedItem) && isItemGroup(processedItem)"
                                :id="getItemId(processedItem) + '_list'"
                                role="group"
                                :panelId="panelId"
                                :focusedItemId="focusedItemId"
                                :items="processedItem.items"
                                :level="level + 1"
                                :templates="templates"
                                :activeItemPath="activeItemPath"
                                @item-toggle="onItemToggle"
                                @item-mousemove="$emit('item-mousemove', $event)"
                                :pt="pt"
                                :unstyled="unstyled"
                                v-bind="ptm('submenu')"
                            />
                        </div>
                    </div>
                </transition>
            </li>
            <li
                v-if="isItemVisible(processedItem) && getItemProp(processedItem, 'separator')"
                :style="getItemProp(processedItem, 'style')"
                :class="[cx('separator'), getItemProp(processedItem, 'class')]"
                role="separator"
                v-bind="ptm('separator')"
            ></li>
        </template>
    </ul>
</template>

<script lang="ts">
import { menuItemHref } from '../internal/menu-item-href';
import { defineComponent, mergeProps, type PropType, type Slots } from 'vue';
import type { ProcessedMenuItem } from '../internal/processed-menu-item';
import { isNotEmpty, resolve } from '../internal/utils/object/index';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import ChevronDownIcon from '../icons/chevrondown/ChevronDownIcon.vue';
import ChevronRightIcon from '../icons/chevronright/ChevronRightIcon.vue';
import Ripple from '../ripple/Ripple';

export default defineComponent({
    name: 'PanelMenuSub',
    hostName: 'PanelMenu',
    extends: BaseComponent,
    emits: ['item-toggle', 'item-mousemove'],
    props: {
        panelId: {
            type: String,
            default: null
        },
        focusedItemId: {
            type: String,
            default: null
        },
        items: {
            type: Array as PropType<ProcessedMenuItem[]>,
            default: () => []
        },
        level: {
            type: Number,
            default: 0
        },
        templates: {
            type: Object as PropType<Slots>,
            default: () => ({})
        },
        activeItemPath: {
            type: Object as PropType<ProcessedMenuItem[]>,
            default: () => []
        },
        tabindex: {
            type: Number,
            default: -1
        }
    },
    methods: {
        menuItemHref,
        getItemId(processedItem: ProcessedMenuItem) {
            return `${this.panelId}_${processedItem.key}`;
        },
        getItemKey(processedItem: ProcessedMenuItem) {
            return this.getItemId(processedItem);
        },
        getItemProp(processedItem: ProcessedMenuItem, name: string, params?: unknown) {
            return processedItem && processedItem.item ? resolve(processedItem.item[name], params) : undefined;
        },
        getItemLabel(processedItem: ProcessedMenuItem) {
            return this.getItemProp(processedItem, 'label');
        },
        getPTOptions(key: string, processedItem: ProcessedMenuItem, index: number) {
            return this.ptm(key, {
                context: {
                    item: processedItem.item,
                    index,
                    active: this.isItemActive(processedItem),
                    focused: this.isItemFocused(processedItem),
                    disabled: this.isItemDisabled(processedItem)
                }
            });
        },
        isItemActive(processedItem: ProcessedMenuItem) {
            return this.activeItemPath.some((path) => path.key === processedItem.key);
        },
        isItemVisible(processedItem: ProcessedMenuItem) {
            return this.getItemProp(processedItem, 'visible') !== false;
        },
        isItemDisabled(processedItem: ProcessedMenuItem) {
            return this.getItemProp(processedItem, 'disabled');
        },
        isItemFocused(processedItem: ProcessedMenuItem) {
            return this.focusedItemId === this.getItemId(processedItem);
        },
        isItemGroup(processedItem: ProcessedMenuItem) {
            return isNotEmpty(processedItem.items);
        },
        onItemClick(event: MouseEvent, processedItem: ProcessedMenuItem) {
            this.getItemProp(processedItem, 'command', { originalEvent: event, item: processedItem.item });
            this.$emit('item-toggle', { processedItem, expanded: !this.isItemActive(processedItem) });
        },
        onItemToggle(event: { processedItem: ProcessedMenuItem; expanded: boolean }) {
            this.$emit('item-toggle', event);
        },
        onItemMouseMove(event: MouseEvent, processedItem: ProcessedMenuItem) {
            this.$emit('item-mousemove', { originalEvent: event, processedItem });
        },
        getAriaSetSize() {
            return this.items.filter((processedItem) => this.isItemVisible(processedItem) && !this.getItemProp(processedItem, 'separator')).length;
        },
        getAriaPosInset(index: number) {
            return (
                index -
                this.items.slice(0, index).filter((processedItem) => this.isItemVisible(processedItem) && this.getItemProp(processedItem, 'separator')).length +
                1
            );
        },
        getMenuItemProps(processedItem: ProcessedMenuItem, index: number) {
            return {
                action: mergeProps(
                    {
                        class: this.cx('itemLink'),
                        tabindex: -1
                    },
                    this.getPTOptions('itemLink', processedItem, index)
                ),
                icon: mergeProps(
                    {
                        class: [this.cx('itemIcon'), this.getItemProp(processedItem, 'icon')]
                    },
                    this.getPTOptions('itemIcon', processedItem, index)
                ),
                label: mergeProps(
                    {
                        class: this.cx('itemLabel')
                    },
                    this.getPTOptions('itemLabel', processedItem, index)
                ),
                submenuicon: mergeProps(
                    {
                        class: this.cx('submenuIcon')
                    },
                    this.getPTOptions('submenuicon', processedItem, index)
                )
            };
        }
    },
    components: {
        ChevronRightIcon: ChevronRightIcon,
        ChevronDownIcon: ChevronDownIcon
    },
    directives: {
        ripple: Ripple
    }
});
</script>
