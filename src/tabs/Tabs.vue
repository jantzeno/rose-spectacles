<template>
    <div :class="cx('root')" v-bind="ptmi('root')">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseTabs from './BaseTabs.vue';
import type { TabsContext, TabValue } from './context';

export default defineComponent({
    name: 'Tabs',
    extends: BaseTabs,
    inheritAttrs: false,
    emits: ['update:value'],
    data() {
        return {
            d_value: this.value as TabValue | undefined
        };
    },
    watch: {
        value(newValue) {
            this.d_value = newValue;
        }
    },
    methods: {
        updateValue(newValue?: TabValue) {
            if (this.d_value !== newValue) {
                this.d_value = newValue;
                this.$emit('update:value', newValue);
            }
        },
        isVertical() {
            return (this as typeof this & Pick<TabsContext, 'orientation'>).orientation === 'vertical';
        }
    }
});
</script>
