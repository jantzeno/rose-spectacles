<template>
    <div :class="cx('root')" v-bind="ptmi('root')">
        <ul ref="nav" :class="cx('tablist')" role="menubar" :aria-labelledby="ariaLabelledby" :aria-label="ariaLabel" v-bind="ptm('tablist')">
            <template v-for="(item, i) of model" :key="`${label(item)}_${i}`">
                <li
                    v-if="visible(item)"
                    ref="tab"
                    :class="[cx('item', { item, index: i }), item.class]"
                    role="presentation"
                    @click="onItemClick($event, item, i)"
                    @keydown="onKeydownItem($event, item, i)"
                    v-bind="getPTOptions('item', item, i)"
                    :data-p-active="d_activeIndex === i"
                    :data-p-disabled="disabled(item)"
                >
                    <template v-if="!$slots.item">
                        <a
                            ref="tabLink"
                            v-ripple
                            role="menuitem"
                            :href="menuItemHref(item.url)"
                            :class="cx('itemLink')"
                            :target="item.target"
                            :aria-label="label(item)"
                            :aria-disabled="disabled(item)"
                            :tabindex="-1"
                            v-bind="getPTOptions('itemLink', item, i)"
                        >
                            <component v-if="$slots.itemicon" :is="$slots.itemicon" :item="item" :class="cx('itemIcon')" />
                            <span v-else-if="item.icon" :class="[cx('itemIcon'), item.icon]" v-bind="getPTOptions('itemIcon', item, i)" />
                            <span :class="cx('itemLabel')" v-bind="getPTOptions('itemLabel', item, i)">{{ label(item) }}</span>
                        </a>
                    </template>
                    <component
                        v-else
                        :is="$slots.item"
                        :item="item"
                        :index="i"
                        :active="i === d_activeIndex"
                        :label="label(item)"
                        :props="getMenuItemProps(item, i)"
                    ></component>
                </li>
            </template>
            <li ref="inkbar" role="none" :class="cx('activeBar')" v-bind="ptm('activeBar')"></li>
        </ul>
    </div>
</template>

<script lang="ts">
import { menuItemHref } from '../internal/menu-item-href';
import { getAttribute, find, findSingle, getWidth, getOffset } from '../internal/utils/dom/index';
import Ripple from '../ripple/Ripple';
import { defineComponent, mergeProps } from 'vue';
import type { MenuItem } from 'rose-spectacles/menuitem';
import BaseTabMenu from './BaseTabMenu.vue';

export default defineComponent({
    name: 'TabMenu',
    extends: BaseTabMenu,
    inheritAttrs: false,
    emits: ['update:activeIndex', 'tab-change'],
    data() {
        return {
            d_activeIndex: this.activeIndex
        };
    },
    watch: {
        activeIndex: {
            flush: 'post',
            handler(newValue) {
                this.d_activeIndex = newValue;
                this.updateInkBar();
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.updateInkBar();
        });

        const activeItem = this.findActiveItem();

        activeItem && (activeItem.tabIndex = 0);
    },
    updated() {
        this.updateInkBar();
    },
    methods: {
        menuItemHref,
        getPTOptions(key: string, item: MenuItem, index: number) {
            return this.ptm(key, {
                context: {
                    item,
                    index
                }
            });
        },
        onItemClick(event: Event, item: MenuItem, index: number) {
            if (this.disabled(item)) {
                event.preventDefault();

                return;
            }

            if (item.command) {
                item.command({
                    originalEvent: event,
                    item: item
                });
            }

            if (index !== this.d_activeIndex) {
                this.d_activeIndex = index;
                this.$emit('update:activeIndex', this.d_activeIndex);
            }

            this.$emit('tab-change', {
                originalEvent: event,
                index: index
            });
        },
        onKeydownItem(event: KeyboardEvent, item: MenuItem, index: number) {
            const target = event.target;

            if (!(target instanceof HTMLElement)) return;

            switch (event.code) {
                case 'ArrowRight': {
                    this.navigateToNextItem(target);
                    event.preventDefault();
                    break;
                }

                case 'ArrowLeft': {
                    this.navigateToPrevItem(target);
                    event.preventDefault();
                    break;
                }

                case 'Home': {
                    this.navigateToFirstItem(target);
                    event.preventDefault();
                    break;
                }

                case 'End': {
                    this.navigateToLastItem(target);
                    event.preventDefault();
                    break;
                }

                case 'Space':
                case 'NumpadEnter':

                case 'Enter': {
                    this.onItemClick(event, item, index);
                    event.preventDefault();
                    break;
                }

                case 'Tab': {
                    this.onTabKey();
                    break;
                }

                default:
                    break;
            }
        },
        navigateToNextItem(target: HTMLElement) {
            const nextItem = this.findNextItem(target);

            nextItem && this.setFocusToMenuitem(target, nextItem);
        },
        navigateToPrevItem(target: HTMLElement) {
            const prevItem = this.findPrevItem(target);

            prevItem && this.setFocusToMenuitem(target, prevItem);
        },
        navigateToFirstItem(target: HTMLElement) {
            const firstItem = this.findFirstItem();

            firstItem && this.setFocusToMenuitem(target, firstItem);
        },
        navigateToLastItem(target: HTMLElement) {
            const lastItem = this.findLastItem();

            lastItem && this.setFocusToMenuitem(target, lastItem);
        },
        findNextItem(item: HTMLElement): HTMLElement | null {
            const nextItem = item.parentElement?.nextElementSibling;
            const target = nextItem?.firstElementChild;

            if (!nextItem || !(target instanceof HTMLElement)) return null;

            return getAttribute(nextItem, 'data-p-disabled') === true ? this.findNextItem(target) : target;
        },
        findPrevItem(item: HTMLElement): HTMLElement | null {
            const prevItem = item.parentElement?.previousElementSibling;
            const target = prevItem?.firstElementChild;

            if (!prevItem || !(target instanceof HTMLElement)) return null;

            return getAttribute(prevItem, 'data-p-disabled') === true ? this.findPrevItem(target) : target;
        },
        findFirstItem() {
            const firstItem = findSingle(this.$refs.nav as HTMLElement, '[data-pc-section="item"][data-p-disabled="false"]')?.firstElementChild;

            return firstItem instanceof HTMLElement ? firstItem : null;
        },
        findLastItem() {
            const siblings = find(this.$refs.nav as HTMLElement, '[data-pc-section="item"][data-p-disabled="false"]');
            const lastItem = siblings.at(-1)?.firstElementChild;

            return lastItem instanceof HTMLElement ? lastItem : null;
        },
        findActiveItem() {
            const activeItem = findSingle(
                this.$refs.nav as HTMLElement,
                '[data-pc-section="item"][data-p-disabled="false"][data-p-active="true"]'
            )?.firstElementChild;

            return activeItem instanceof HTMLElement ? activeItem : null;
        },
        setFocusToMenuitem(target: HTMLElement, focusableItem: HTMLElement) {
            target.tabIndex = -1;
            focusableItem.tabIndex = 0;
            focusableItem.focus();
        },
        onTabKey() {
            const activeItem = this.findActiveItem();
            const focusedItem = findSingle(this.$refs.nav as HTMLElement, '[data-pc-section="itemlink"][tabindex="0"]');

            if (activeItem && focusedItem instanceof HTMLElement && focusedItem !== activeItem) {
                activeItem.tabIndex = 0;
                focusedItem.tabIndex = -1;
            }
        },
        visible(item: MenuItem) {
            return typeof item.visible === 'function' ? item.visible() : item.visible !== false;
        },
        disabled(item: MenuItem) {
            return typeof item.disabled === 'function' ? item.disabled() : item.disabled === true;
        },
        label(item: MenuItem) {
            return typeof item.label === 'function' ? item.label() : item.label;
        },
        updateInkBar() {
            const nav = this.$refs.nav as HTMLElement;
            const inkbar = this.$refs.inkbar as HTMLElement;
            const tabs = nav.children;
            let inkHighlighted = false;

            for (let i = 0; i < tabs.length; i++) {
                let tab = tabs[i];

                if (tab instanceof HTMLElement && getAttribute(tab, 'data-p-active')) {
                    inkbar.style.width = getWidth(tab) + 'px';
                    inkbar.style.left = getOffset(tab).left - getOffset(nav).left + 'px';
                    inkHighlighted = true;
                }
            }

            if (!inkHighlighted) {
                inkbar.style.width = '0px';
                inkbar.style.left = '0px';
            }
        },
        getMenuItemProps(item: MenuItem, index: number) {
            return {
                action: mergeProps(
                    {
                        class: this.cx('itemLink'),
                        tabindex: -1,
                        onClick: ($event: MouseEvent) => this.onItemClick($event, item, index),
                        onKeyDown: ($event: KeyboardEvent) => this.onKeydownItem($event, item, index)
                    },
                    this.getPTOptions('itemLink', item, index)
                ),
                icon: mergeProps(
                    {
                        class: [this.cx('itemIcon'), item.icon]
                    },
                    this.getPTOptions('itemIcon', item, index)
                ),
                label: mergeProps(
                    {
                        class: this.cx('itemLabel')
                    },
                    this.getPTOptions('itemLabel', item, index)
                )
            };
        }
    },
    directives: {
        ripple: Ripple
    }
});
</script>
