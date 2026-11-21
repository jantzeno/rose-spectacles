<template>
    <div :class="cx('root')" v-bind="ptmi('root')">
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseStepPanels from './BaseStepPanels.vue';

export default defineComponent({
    name: 'StepPanels',
    extends: BaseStepPanels,
    inheritAttrs: false
});
</script>
