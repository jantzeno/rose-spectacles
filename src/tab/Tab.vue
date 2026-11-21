<template>
    <component v-if="!asChild" :is="as" v-ripple :class="cx('root')" :data-p="dataP" @click="onClick" v-bind="attrs">
        <slot></slot>
    </component>
    <slot v-else :dataP="dataP" :class="cx('root')" :active="active" :a11yAttrs="a11yAttrs" :onClick="onClick"></slot>
</template>

<script lang="ts">
import type { TabsContext } from '../tabs/context';
import { cn } from '../internal/utils/index';
import { findSingle, focus, getAttribute } from '../internal/utils/dom/index';
import { equals } from '../internal/utils/object/index';
import Ripple from '../ripple/Ripple';
import { defineComponent, mergeProps } from 'vue';
import BaseTab from './BaseTab.vue';

export default defineComponent({
    name: 'Tab',
    extends: BaseTab,
    inheritAttrs: false,
    inject: ['$pcTabs', '$pcTabList'],
    methods: {
        onFocus() {
            this.tabsContext.selectOnFocus && this.changeActiveValue();
        },
        onClick() {
            this.changeActiveValue();
        },
        onKeydown(event: KeyboardEvent) {
            switch (event.code) {
                case 'ArrowRight':
                    this.onArrowRightKey(event);
                    break;

                case 'ArrowLeft':
                    this.onArrowLeftKey(event);
                    break;

                case 'Home':
                    this.onHomeKey(event);
                    break;

                case 'End':
                    this.onEndKey(event);
                    break;

                case 'PageDown':
                    this.onPageDownKey(event);
                    break;

                case 'PageUp':
                    this.onPageUpKey(event);
                    break;

                case 'Enter':
                case 'NumpadEnter':
                case 'Space':
                    this.onEnterKey(event);
                    break;

                default:
                    break;
            }
        },
        onArrowRightKey(event: KeyboardEvent) {
            const nextTab = this.findNextTab(event.currentTarget as Element);

            nextTab ? this.changeFocusedTab(event, nextTab) : this.onHomeKey(event);
            event.preventDefault();
        },
        onArrowLeftKey(event: KeyboardEvent) {
            const prevTab = this.findPrevTab(event.currentTarget as Element);

            prevTab ? this.changeFocusedTab(event, prevTab) : this.onEndKey(event);
            event.preventDefault();
        },
        onHomeKey(event: KeyboardEvent) {
            const firstTab = this.findFirstTab();

            this.changeFocusedTab(event, firstTab);
            event.preventDefault();
        },
        onEndKey(event: KeyboardEvent) {
            const lastTab = this.findLastTab();

            this.changeFocusedTab(event, lastTab);
            event.preventDefault();
        },
        onPageDownKey(event: KeyboardEvent) {
            this.scrollInView(this.findLastTab());
            event.preventDefault();
        },
        onPageUpKey(event: KeyboardEvent) {
            this.scrollInView(this.findFirstTab());
            event.preventDefault();
        },
        onEnterKey(event: KeyboardEvent) {
            this.changeActiveValue();
        },
        findNextTab(tabElement: Element | null, selfCheck = false): Element | null {
            const element = selfCheck ? tabElement : tabElement!.nextElementSibling;

            return element
                ? getAttribute(element, 'data-p-disabled') || getAttribute(element, 'data-pc-section') === 'activebar'
                    ? this.findNextTab(element)
                    : findSingle(element, '[data-pc-name="tab"]')
                : null;
        },
        findPrevTab(tabElement: Element | null, selfCheck = false): Element | null {
            const element = selfCheck ? tabElement : tabElement!.previousElementSibling;

            return element
                ? getAttribute(element, 'data-p-disabled') || getAttribute(element, 'data-pc-section') === 'activebar'
                    ? this.findPrevTab(element)
                    : findSingle(element, '[data-pc-name="tab"]')
                : null;
        },
        findFirstTab() {
            return this.findNextTab(this.tabListElement.firstElementChild, true);
        },
        findLastTab() {
            return this.findPrevTab(this.tabListElement.lastElementChild, true);
        },
        changeActiveValue() {
            this.tabsContext.updateValue(this.value);
        },
        changeFocusedTab(event: KeyboardEvent, element: Element | null) {
            focus(element as HTMLElement);
            this.scrollInView(element);
        },
        scrollInView(element: Element | null) {
            element?.scrollIntoView?.({ block: 'nearest' });
        }
    },
    computed: {
        tabsContext() {
            return this.$pcTabs as TabsContext;
        },
        tabListElement() {
            return (this.$pcTabList as { $refs: { tabs: HTMLElement } }).$refs.tabs;
        },
        active() {
            return equals(this.tabsContext?.d_value, this.value);
        },
        id() {
            return `${this.tabsContext?.$id}_tab_${this.value}`;
        },
        ariaControls() {
            return `${this.tabsContext?.$id}_tabpanel_${this.value}`;
        },
        attrs() {
            return mergeProps(this.asAttrs, this.a11yAttrs, this.ptmi('root', this.ptParams));
        },
        asAttrs() {
            return this.as === 'BUTTON' ? { type: 'button', disabled: this.disabled } : {};
        },
        a11yAttrs() {
            return {
                id: this.id,
                tabindex: this.active ? this.tabsContext.tabindex : -1,
                role: 'tab',
                'aria-selected': this.active,
                'aria-controls': this.ariaControls,
                'data-pc-name': 'tab',
                'data-p-disabled': this.disabled,
                'data-p-active': this.active,
                onFocus: this.onFocus,
                onKeydown: this.onKeydown
            };
        },
        ptParams() {
            return {
                context: {
                    active: this.active
                }
            };
        },
        dataP() {
            return cn({
                active: this.active
            });
        }
    },
    directives: {
        ripple: Ripple
    }
});
</script>
