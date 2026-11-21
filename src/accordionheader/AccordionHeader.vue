<template>
    <component v-if="!asChild" :is="as" v-ripple :data-p="dataP" :class="cx('root')" @click="onClick" v-bind="attrs">
        <slot :active="accordionPanel.active"></slot>
        <slot name="toggleicon" :active="accordionPanel.active" :class="cx('toggleicon')">
            <component
                v-if="accordionPanel.active"
                :is="accordion.$slots.collapseicon ? accordion.$slots.collapseicon : accordion.collapseIcon ? 'span' : 'ChevronUpIcon'"
                :class="[accordion.collapseIcon, cx('toggleicon')]"
                aria-hidden="true"
                v-bind="ptm('toggleicon', ptParams)"
            ></component>
            <component
                v-else
                :is="accordion.$slots.expandicon ? accordion.$slots.expandicon : accordion.expandIcon ? 'span' : 'ChevronDownIcon'"
                :class="[accordion.expandIcon, cx('toggleicon')]"
                aria-hidden="true"
                v-bind="ptm('toggleicon', ptParams)"
            ></component>
        </slot>
    </component>
    <slot v-else :class="cx('root')" :active="accordionPanel.active" :a11yAttrs="a11yAttrs" :onClick="onClick"></slot>
</template>

<script lang="ts">
import { cn } from '../internal/utils/index';
import { findSingle, focus, getAttribute } from '../internal/utils/dom/index';
import ChevronDownIcon from '../icons/chevrondown/ChevronDownIcon.vue';
import ChevronUpIcon from '../icons/chevronup/ChevronUpIcon.vue';
import Ripple from '../ripple/Ripple';
import type { AccordionContext, AccordionPanelContext } from '../accordion/context';
import { defineComponent, mergeProps } from 'vue';
import BaseAccordionHeader from './BaseAccordionHeader.vue';

export default defineComponent({
    name: 'AccordionHeader',
    extends: BaseAccordionHeader,
    inheritAttrs: false,
    inject: ['$pcAccordion', '$pcAccordionPanel'],
    methods: {
        onFocus() {
            this.accordion.selectOnFocus && this.changeActiveValue();
        },
        onClick() {
            !this.accordion.selectOnFocus && this.changeActiveValue();
        },
        onKeydown(event: KeyboardEvent) {
            switch (event.code) {
                case 'ArrowDown':
                    this.onArrowDownKey(event);
                    break;

                case 'ArrowUp':
                    this.onArrowUpKey(event);
                    break;

                case 'Home':
                    this.onHomeKey(event);
                    break;

                case 'End':
                    this.onEndKey(event);
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
        onArrowDownKey(event: KeyboardEvent) {
            const nextPanel = this.findNextPanel(this.findPanel(event.currentTarget as HTMLElement));

            nextPanel ? this.changeFocusedPanel(event, nextPanel) : this.onHomeKey(event);
            event.preventDefault();
        },
        onArrowUpKey(event: KeyboardEvent) {
            const prevPanel = this.findPrevPanel(this.findPanel(event.currentTarget as HTMLElement));

            prevPanel ? this.changeFocusedPanel(event, prevPanel) : this.onEndKey(event);
            event.preventDefault();
        },
        onHomeKey(event: KeyboardEvent) {
            const firstPanel = this.findFirstPanel();

            this.changeFocusedPanel(event, firstPanel);
            event.preventDefault();
        },
        onEndKey(event: KeyboardEvent) {
            const lastPanel = this.findLastPanel();

            this.changeFocusedPanel(event, lastPanel);
            event.preventDefault();
        },
        onEnterKey(event: KeyboardEvent) {
            this.changeActiveValue();
            event.preventDefault();
        },
        findPanel(headerElement?: HTMLElement) {
            return headerElement?.closest('[data-pc-name="accordionpanel"]');
        },
        findHeader(panelElement: Element | null | undefined) {
            return findSingle(panelElement!, '[data-pc-name="accordionheader"]');
        },
        findNextPanel(panelElement: Element | null | undefined, selfCheck = false): Element | null {
            const element = selfCheck ? panelElement : panelElement!.nextElementSibling;

            return element ? (getAttribute(element, 'data-p-disabled') ? this.findNextPanel(element) : this.findHeader(element)) : null;
        },
        findPrevPanel(panelElement: Element | null | undefined, selfCheck = false): Element | null {
            const element = selfCheck ? panelElement : panelElement!.previousElementSibling;

            return element ? (getAttribute(element, 'data-p-disabled') ? this.findPrevPanel(element) : this.findHeader(element)) : null;
        },
        findFirstPanel() {
            return this.findNextPanel(this.accordion.$el.firstElementChild, true);
        },
        findLastPanel() {
            return this.findPrevPanel(this.accordion.$el.lastElementChild, true);
        },
        changeActiveValue() {
            this.accordion.updateValue(this.accordionPanel.value);
        },
        changeFocusedPanel(event: KeyboardEvent, element: Element | null) {
            focus(this.findHeader(element) as HTMLElement);
        }
    },
    computed: {
        accordion() {
            return this.$pcAccordion as AccordionContext;
        },
        accordionPanel() {
            return this.$pcAccordionPanel as AccordionPanelContext;
        },
        id() {
            return `${this.accordion.$id}_accordionheader_${this.accordionPanel.value}`;
        },
        ariaControls() {
            return `${this.accordion.$id}_accordioncontent_${this.accordionPanel.value}`;
        },
        attrs() {
            return mergeProps(this.asAttrs, this.a11yAttrs, this.ptmi('root', this.ptParams));
        },
        asAttrs() {
            return this.as === 'BUTTON' ? { type: 'button', disabled: this.accordionPanel.disabled } : {};
        },
        a11yAttrs() {
            return {
                id: this.id,
                tabindex: this.accordion.tabindex,
                'aria-expanded': this.accordionPanel.active,
                'aria-controls': this.ariaControls,
                'data-pc-name': 'accordionheader',
                'data-p-disabled': this.accordionPanel.disabled,
                'data-p-active': this.accordionPanel.active,
                onFocus: this.onFocus,
                onKeydown: this.onKeydown
            };
        },
        ptParams() {
            return {
                context: {
                    active: this.accordionPanel.active
                }
            };
        },
        dataP() {
            return cn({
                active: this.accordionPanel.active
            });
        }
    },
    components: {
        ChevronUpIcon,
        ChevronDownIcon
    },
    directives: {
        ripple: Ripple
    }
});
</script>
