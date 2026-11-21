<template>
    <div :class="cx('root')" :data-p-active="isActive" v-bind="ptmi('root')">
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseStepItem from './BaseStepItem.vue';

export default defineComponent({
    name: 'StepItem',
    extends: BaseStepItem,
    inheritAttrs: false,
    inject: ['$pcStepper'],
    computed: {
        isActive() {
            return (this.$pcStepper as { d_value?: string | number } | undefined)?.d_value === this.value;
        }
    }
});
</script>
