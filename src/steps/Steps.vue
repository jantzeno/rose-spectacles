<template>
    <nav :id="id" :class="cx('root')" v-bind="ptmi('root')">
        <ol ref="list" :class="cx('list')" v-bind="ptm('list')">
            <template v-for="(item, index) of model" :key="`${label(item)}_${index}`">
                <li
                    v-if="visible(item)"
                    :class="[cx('item', { item, index }), item.class]"
                    :style="item.style"
                    :aria-current="isActive(index) ? 'step' : undefined"
                    @click="onItemClick($event, item, index)"
                    @keydown="onItemKeydown($event, item, index)"
                    v-bind="getPTOptions('item', item, index)"
                    :data-p-active="isActive(index)"
                    :data-p-disabled="isItemDisabled(item, index)"
                >
                    <template v-if="!$slots.item">
                        <span :class="cx('itemLink')" v-bind="getPTOptions('itemLink', item, index)">
                            <span :class="cx('itemNumber')" v-bind="getPTOptions('itemNumber', item, index)">{{ index + 1 }}</span>
                            <span :class="cx('itemLabel')" v-bind="getPTOptions('itemLabel', item, index)">{{ label(item) }}</span>
                        </span>
                    </template>
                    <component
                        v-else
                        :is="$slots.item"
                        :item="item"
                        :index="index"
                        :active="index === d_activeStep"
                        :label="label(item)"
                        :props="getMenuItemProps(item, index)"
                    ></component>
                </li>
            </template>
        </ol>
    </nav>
</template>

<script lang="ts">
import { findSingle, find } from '../internal/utils/dom/index';
import { defineComponent, mergeProps } from 'vue';
import type { MenuItem } from 'rose-spectacles/menuitem';
import BaseSteps from './BaseSteps.vue';

export default defineComponent({
    name: 'Steps',
    extends: BaseSteps,
    inheritAttrs: false,
    emits: ['update:activeStep', 'step-change'],
    data() {
        return {
            d_activeStep: this.activeStep
        };
    },
    watch: {
        activeStep(newValue) {
            this.d_activeStep = newValue;
        }
    },
    mounted() {
        const firstItem = this.findFirstItem();

        firstItem && (firstItem.tabIndex = 0);
    },
    methods: {
        getPTOptions(key: string, item: MenuItem, index: number) {
            return this.ptm(key, {
                context: {
                    item,
                    index,
                    active: this.isActive(index),
                    disabled: this.isItemDisabled(item, index)
                }
            });
        },
        onItemClick(event: Event, item: MenuItem, index: number) {
            if (this.disabled(item) || this.readonly) {
                event.preventDefault();

                return;
            }

            if (item.command) {
                item.command({
                    originalEvent: event,
                    item: item
                });
            }

            if (index !== this.d_activeStep) {
                this.d_activeStep = index;
                this.$emit('update:activeStep', this.d_activeStep);
            }

            this.$emit('step-change', {
                originalEvent: event,
                index: index
            });
        },
        onItemKeydown(event: KeyboardEvent, item: MenuItem, index: number) {
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

                case 'Tab':
                    //no op
                    break;

                case 'Enter':
                case 'NumpadEnter':

                case 'Space': {
                    this.onItemClick(event, item, index);
                    event.preventDefault();
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
        findNextItem(item: HTMLElement) {
            const nextItem = item.parentElement?.nextElementSibling?.firstElementChild;

            return nextItem instanceof HTMLElement ? nextItem : null;
        },
        findPrevItem(item: HTMLElement) {
            const prevItem = item.parentElement?.previousElementSibling?.firstElementChild;

            return prevItem instanceof HTMLElement ? prevItem : null;
        },
        findFirstItem() {
            const firstItem = findSingle(this.$refs.list as HTMLElement, '[data-pc-section="item"]')?.firstElementChild;

            return firstItem instanceof HTMLElement ? firstItem : null;
        },
        findLastItem() {
            const siblings = find(this.$refs.list as HTMLElement, '[data-pc-section="item"]');
            const lastItem = siblings.at(-1)?.firstElementChild;

            return lastItem instanceof HTMLElement ? lastItem : null;
        },
        setFocusToMenuitem(target: HTMLElement, focusableItem: HTMLElement) {
            target.tabIndex = -1;
            focusableItem.tabIndex = 0;
            focusableItem.focus();
        },
        isActive(index: number) {
            return index === this.d_activeStep;
        },
        isItemDisabled(item: MenuItem, index: number) {
            return this.disabled(item) || (this.readonly && !this.isActive(index));
        },
        visible(item: MenuItem) {
            return typeof item.visible === 'function' ? item.visible() : item.visible !== false;
        },
        disabled(item: MenuItem) {
            return typeof item.disabled === 'function' ? item.disabled() : item.disabled;
        },
        label(item: MenuItem) {
            return typeof item.label === 'function' ? item.label() : item.label;
        },
        getMenuItemProps(item: MenuItem, index: number) {
            return {
                action: mergeProps(
                    {
                        class: this.cx('itemLink'),
                        onClick: ($event: MouseEvent) => this.onItemClick($event, item, index),
                        onKeyDown: ($event: KeyboardEvent) => this.onItemKeydown($event, item, index)
                    },
                    this.getPTOptions('itemLink', item, index)
                ),
                step: mergeProps(
                    {
                        class: this.cx('itemNumber')
                    },
                    this.getPTOptions('itemNumber', item, index)
                ),
                label: mergeProps(
                    {
                        class: this.cx('itemLabel')
                    },
                    this.getPTOptions('itemLabel', item, index)
                )
            };
        }
    }
});
</script>
