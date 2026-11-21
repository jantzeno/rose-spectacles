<template>
    <div :class="cx('listContainer')" v-bind="ptm('listContainer')">
        <ul
            ref="list"
            :id="idx"
            :class="cx('list')"
            role="menu"
            :aria-orientation="position === 'bottom' || position === 'top' ? 'horizontal' : 'vertical'"
            :aria-activedescendant="focused ? focusedOptionId : undefined"
            :tabindex="tabindex"
            :aria-label="ariaLabel"
            :aria-labelledby="ariaLabelledby"
            @focus="onListFocus"
            @blur="onListBlur"
            @keydown="onListKeyDown"
            @mouseleave="onListMouseLeave"
            v-bind="ptm('list')"
        >
            <template v-for="(processedItem, index) of model" :key="index">
                <li
                    :id="getItemId(index)"
                    :class="cx('item', { processedItem, id: getItemId(index) })"
                    role="menuitem"
                    :aria-label="itemLabel(processedItem)"
                    :aria-disabled="disabled(processedItem)"
                    @click="onItemClick($event, processedItem)"
                    @mouseenter="onItemMouseEnter(index)"
                    v-bind="getPTOptions('item', processedItem, index)"
                    :data-p-focused="isItemActive(getItemId(index))"
                    :data-p-disabled="disabled(processedItem) || false"
                >
                    <div :class="cx('itemContent')" v-bind="getPTOptions('itemContent', processedItem, index)">
                        <template v-if="!templates['item']">
                            <a
                                v-tooltip:[tooltipOptions]="{ value: itemLabel(processedItem), disabled: !tooltipOptions }"
                                :href="menuItemHref(processedItem.url)"
                                :class="cx('itemLink')"
                                :target="processedItem.target"
                                tabindex="-1"
                                v-bind="getPTOptions('itemLink', processedItem, index)"
                            >
                                <!-- TODO: icon deprecated since v4.0-->
                                <template v-if="!templates['icon'] && !templates['itemicon']">
                                    <span v-ripple :class="[cx('itemIcon'), processedItem.icon]" v-bind="getPTOptions('itemIcon', processedItem, index)"></span>
                                </template>
                                <component v-else :is="templates['icon'] || templates['itemicon']" :item="processedItem" :class="cx('itemIcon')"></component>
                            </a>
                        </template>
                        <component
                            v-else
                            :is="templates['item']"
                            :item="processedItem"
                            :index="index"
                            :label="itemLabel(processedItem)"
                            :props="getMenuItemProps(processedItem, index)"
                        ></component>
                    </div>
                </li>
            </template>
        </ul>
    </div>
</template>

<script lang="ts">
import { menuItemHref } from '../internal/menu-item-href';
import { defineComponent, mergeProps, type PropType, type Slots } from 'vue';
import type { MenuItem } from 'rose-spectacles/menuitem';
import { find, findSingle } from '../internal/utils/dom/index';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import Ripple from '../ripple/Ripple';
import Tooltip from '../tooltip/Tooltip';

type DockItem = MenuItem & { item?: MenuItem };

export default defineComponent({
    name: 'DockSub',
    hostName: 'Dock',
    extends: BaseComponent,
    emits: ['focus', 'blur'],
    props: {
        position: {
            type: String,
            default: 'bottom'
        },
        model: {
            type: Array as PropType<DockItem[]>,
            default: () => []
        },
        templates: {
            type: Object as PropType<Slots>,
            default: () => ({})
        },
        tooltipOptions: null,
        menuId: {
            type: String,
            default: null
        },
        tabindex: {
            type: Number,
            default: 0
        },
        ariaLabel: {
            type: String,
            default: null
        },
        ariaLabelledby: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            currentIndex: -3,
            focused: false,
            focusedOptionIndex: -1 as string | -1
        };
    },
    methods: {
        menuItemHref,
        getItemId(index: number) {
            return `${this.idx}_${index}`;
        },
        getPTOptions(key: string, item: DockItem, index: number) {
            return this.ptm(key, {
                context: {
                    index,
                    item,
                    active: this.isItemActive(this.getItemId(index))
                }
            });
        },
        isSameMenuItem(event: MouseEvent) {
            const { currentTarget, target } = event;

            return (
                currentTarget instanceof Element &&
                target instanceof Element &&
                (currentTarget === target || currentTarget === target.closest('[data-pc-section="item"]'))
            );
        },
        isItemActive(id: string) {
            return id === this.focusedOptionIndex;
        },
        onListMouseLeave() {
            this.currentIndex = -3;
        },
        onItemMouseEnter(index: number) {
            this.currentIndex = index;
        },
        onItemClick(event: MouseEvent, processedItem: DockItem) {
            if (this.isSameMenuItem(event) && !this.disabled(processedItem)) {
                const item = processedItem.item ?? processedItem;

                item.command?.({ originalEvent: event, item });
            }
        },
        onListFocus(event: FocusEvent) {
            this.focused = true;
            this.changeFocusedOptionIndex(0);
            this.$emit('focus', event);
        },
        onListBlur(event: FocusEvent) {
            this.focused = false;
            this.focusedOptionIndex = -1;
            this.$emit('blur', event);
        },
        onListKeyDown(event: KeyboardEvent) {
            switch (event.code) {
                case 'ArrowDown': {
                    if (this.position === 'left' || this.position === 'right') this.onArrowDownKey();
                    event.preventDefault();
                    break;
                }

                case 'ArrowUp': {
                    if (this.position === 'left' || this.position === 'right') this.onArrowUpKey();
                    event.preventDefault();
                    break;
                }

                case 'ArrowRight': {
                    if (this.position === 'top' || this.position === 'bottom') this.onArrowDownKey();
                    event.preventDefault();
                    break;
                }

                case 'ArrowLeft': {
                    if (this.position === 'top' || this.position === 'bottom') this.onArrowUpKey();
                    event.preventDefault();
                    break;
                }

                case 'Home': {
                    this.onHomeKey();
                    event.preventDefault();
                    break;
                }

                case 'End': {
                    this.onEndKey();
                    event.preventDefault();
                    break;
                }

                case 'Enter':
                case 'NumpadEnter':

                case 'Space': {
                    this.onSpaceKey();
                    event.preventDefault();
                    break;
                }

                default:
                    break;
            }
        },
        onArrowDownKey() {
            const optionIndex = this.findNextOptionIndex(this.focusedOptionIndex);

            this.changeFocusedOptionIndex(optionIndex);
        },
        onArrowUpKey() {
            const optionIndex = this.findPrevOptionIndex(this.focusedOptionIndex);

            this.changeFocusedOptionIndex(optionIndex);
        },
        onHomeKey() {
            this.changeFocusedOptionIndex(0);
        },
        onEndKey() {
            this.changeFocusedOptionIndex(this.getFocusableItems().length - 1);
        },
        onSpaceKey() {
            const element = findSingle(this.$refs.list as HTMLElement, `li[id="${`${this.focusedOptionIndex}`}"]`);
            const anchorElement = element && findSingle(element, '[data-pc-section="itemlink"]');

            const target = anchorElement ?? element;

            if (target instanceof HTMLElement) target.click();
        },
        getFocusableItems() {
            return find(this.$refs.list as HTMLElement, 'li[data-pc-section="item"][data-p-disabled="false"]');
        },
        findNextOptionIndex(index: string | -1) {
            const menuitems = this.getFocusableItems();
            const matchedOptionIndex = [...menuitems].findIndex((link) => link.id === index);

            return matchedOptionIndex > -1 ? matchedOptionIndex + 1 : 0;
        },
        findPrevOptionIndex(index: string | -1) {
            const menuitems = this.getFocusableItems();
            const matchedOptionIndex = [...menuitems].findIndex((link) => link.id === index);

            return matchedOptionIndex > -1 ? matchedOptionIndex - 1 : 0;
        },
        changeFocusedOptionIndex(index: number) {
            const menuitems = this.getFocusableItems();

            const order = Math.max(0, Math.min(index, menuitems.length - 1));

            this.focusedOptionIndex = menuitems[order]?.id ?? -1;
        },
        itemLabel(item: DockItem) {
            return typeof item.label === 'function' ? item.label() : item.label;
        },
        disabled(item: DockItem) {
            return typeof item.disabled === 'function' ? item.disabled() : item.disabled;
        },
        getMenuItemProps(item: DockItem, index: number) {
            return {
                action: mergeProps(
                    {
                        tabindex: -1,
                        class: this.cx('itemLink')
                    },
                    this.getPTOptions('itemLink', item, index)
                ),
                icon: mergeProps(
                    {
                        class: [this.cx('itemIcon'), item.icon]
                    },
                    this.getPTOptions('itemIcon', item, index)
                )
            };
        }
    },
    computed: {
        focusedOptionId() {
            return this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : undefined;
        },
        idx() {
            return this.menuId || this.$id;
        }
    },
    directives: {
        ripple: Ripple,
        tooltip: Tooltip
    }
});
</script>
