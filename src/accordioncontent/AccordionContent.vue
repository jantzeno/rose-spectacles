<template>
    <template v-if="!asChild">
        <transition name="rs-collapsible" v-bind="ptm('transition', ptParams)">
            <component
                v-if="accordion.lazy ? accordionPanel.active : true"
                v-show="accordion.lazy ? true : accordionPanel.active"
                :is="as"
                :class="cx('root')"
                v-bind="attrs"
            >
                <div :class="cx('contentWrapper')" v-bind="ptm('contentWrapper', ptParams)">
                    <div :class="cx('content')" v-bind="ptm('content', ptParams)">
                        <slot></slot>
                    </div>
                </div>
            </component>
        </transition>
    </template>
    <slot v-else :class="cx('root')" :active="accordionPanel.active" :a11yAttrs="a11yAttrs"></slot>
</template>

<script lang="ts">
import type { AccordionContext, AccordionPanelContext } from '../accordion/context';
import { defineComponent, mergeProps } from 'vue';
import BaseAccordionContent from './BaseAccordionContent.vue';

export default defineComponent({
    name: 'AccordionContent',
    extends: BaseAccordionContent,
    inheritAttrs: false,
    inject: ['$pcAccordion', '$pcAccordionPanel'],
    computed: {
        accordion() {
            return this.$pcAccordion as AccordionContext;
        },
        accordionPanel() {
            return this.$pcAccordionPanel as AccordionPanelContext;
        },
        id() {
            return `${this.accordion.$id}_accordioncontent_${this.accordionPanel.value}`;
        },
        ariaLabelledby() {
            return `${this.accordion.$id}_accordionheader_${this.accordionPanel.value}`;
        },
        attrs() {
            return mergeProps(this.a11yAttrs, this.ptmi('root', this.ptParams));
        },
        a11yAttrs() {
            return {
                id: this.id,
                role: 'region',
                'aria-labelledby': this.ariaLabelledby,
                'data-pc-name': 'accordioncontent',
                'data-p-active': this.accordionPanel.active
            };
        },
        ptParams() {
            return {
                context: {
                    active: this.accordionPanel.active
                }
            };
        }
    }
});
</script>
