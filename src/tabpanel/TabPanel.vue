<template>
    <slot v-if="!tabsContext"></slot>
    <template v-else>
        <template v-if="!asChild">
            <component v-if="tabsContext?.lazy ? active : true" v-show="tabsContext?.lazy ? true : active" :is="as" :class="cx('root')" v-bind="attrs">
                <slot></slot>
            </component>
        </template>

        <slot v-else :class="cx('root')" :active="active" :a11yAttrs="a11yAttrs"></slot>
    </template>
</template>

<script lang="ts">
import type { TabsContext } from '../tabs/context';
import { equals } from '../internal/utils/object/index';
import { defineComponent, mergeProps } from 'vue';
import BaseTabPanel from './BaseTabPanel.vue';

export default defineComponent({
    name: 'TabPanel',
    extends: BaseTabPanel,
    inheritAttrs: false,
    inject: ['$pcTabs'],
    computed: {
        tabsContext() {
            return this.$pcTabs as TabsContext | undefined;
        },
        active() {
            return equals(this.tabsContext?.d_value, this.value);
        },
        id() {
            return `${this.tabsContext?.$id}_tabpanel_${this.value}`;
        },
        ariaLabelledby() {
            return `${this.tabsContext?.$id}_tab_${this.value}`;
        },
        attrs() {
            return mergeProps(this.a11yAttrs, this.ptmi('root', this.ptParams));
        },
        a11yAttrs() {
            return {
                id: this.id,
                tabindex: this.tabsContext?.tabindex,
                role: 'tabpanel',
                'aria-labelledby': this.ariaLabelledby,
                'data-pc-name': 'tabpanel',
                'data-p-active': this.active
            };
        },
        ptParams() {
            return {
                context: {
                    active: this.active
                }
            };
        }
    }
});
</script>
