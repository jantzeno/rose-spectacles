<template>
    <li
        v-if="visible()"
        :id="id"
        :class="[cx('item'), item.class]"
        role="menuitem"
        :style="item.style"
        :aria-label="label()"
        :aria-disabled="disabled()"
        :data-p-focused="isItemFocused()"
        :data-p-disabled="disabled() || false"
        :data-p="dataP"
        v-bind="getPTOptions('item')"
    >
        <div :class="cx('itemContent')" @click="onItemClick($event)" @mousemove="onItemMouseMove($event)" :data-p="dataP" v-bind="getPTOptions('itemContent')">
            <template v-if="!templates.item">
                <a v-ripple :href="item.url" :class="cx('itemLink')" :target="item.target" tabindex="-1" v-bind="getPTOptions('itemLink')">
                    <component v-if="templates.itemicon" :is="templates.itemicon" :item="item" :class="cx('itemIcon')" />
                    <span v-else-if="item.icon" :class="[cx('itemIcon'), item.icon]" :data-p="dataP" v-bind="getPTOptions('itemIcon')" />
                    <span :class="cx('itemLabel')" :data-p="dataP" v-bind="getPTOptions('itemLabel')">{{ label() }}</span>
                </a>
            </template>
            <component v-else-if="templates.item" :is="templates.item" :item="item" :label="label()" :props="getMenuItemProps(item)"></component>
        </div>
    </li>
</template>

<script lang="ts">
import { defineComponent, mergeProps, type PropType, type Slots } from 'vue';
import type { MenuItem } from 'rose-spectacles/menuitem';
import { cn } from '../internal/utils/index';
import { resolve } from '../internal/utils/object/index';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import Ripple from '../ripple/Ripple';

type MenuEntry = MenuItem & { item?: MenuItem };

export interface MenuItemInteraction {
    originalEvent: MouseEvent;
    item: MenuItem;
    id: string;
}

export default defineComponent({
    name: 'Menuitem',
    hostName: 'Menu',
    extends: BaseComponent,
    inheritAttrs: false,
    emits: ['item-click', 'item-mousemove'],
    props: {
        item: { type: Object as PropType<MenuEntry>, required: true },
        templates: { type: Object as PropType<Slots>, default: () => ({}) },
        id: { type: String, required: true },
        focusedOptionId: null as unknown as PropType<string | null>,
        index: Number
    },
    methods: {
        getItemProp(processedItem: MenuEntry, name: string): unknown {
            return processedItem && processedItem.item ? resolve(processedItem.item[name]) : undefined;
        },
        getPTOptions(key: string) {
            return this.ptm(key, {
                context: {
                    item: this.item,
                    index: this.index,
                    focused: this.isItemFocused(),
                    disabled: this.disabled()
                }
            });
        },
        isItemFocused() {
            return this.focusedOptionId === this.id;
        },
        onItemClick(event: MouseEvent) {
            const command = this.getItemProp(this.item, 'command');
            const interaction: MenuItemInteraction = { originalEvent: event, item: this.item, id: this.id };

            if (typeof command === 'function') command({ originalEvent: event, item: this.item.item });

            this.$emit('item-click', interaction);
        },
        onItemMouseMove(event: MouseEvent) {
            const interaction: MenuItemInteraction = { originalEvent: event, item: this.item, id: this.id };

            this.$emit('item-mousemove', interaction);
        },
        visible() {
            return typeof this.item.visible === 'function' ? this.item.visible() : this.item.visible !== false;
        },
        disabled() {
            return typeof this.item.disabled === 'function' ? this.item.disabled() : this.item.disabled;
        },
        label() {
            return typeof this.item.label === 'function' ? this.item.label() : this.item.label;
        },
        getMenuItemProps(item: MenuItem) {
            return {
                action: mergeProps(
                    {
                        class: this.cx('itemLink'),
                        tabindex: '-1'
                    },
                    this.getPTOptions('itemLink')
                ),
                icon: mergeProps(
                    {
                        class: [this.cx('itemIcon'), item.icon]
                    },
                    this.getPTOptions('itemIcon')
                ),
                label: mergeProps(
                    {
                        class: this.cx('itemLabel')
                    },
                    this.getPTOptions('itemLabel')
                )
            };
        }
    },
    computed: {
        dataP() {
            return cn({
                focus: this.isItemFocused(),
                disabled: this.disabled()
            });
        }
    },
    directives: {
        ripple: Ripple
    }
});
</script>
