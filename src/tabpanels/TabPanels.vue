<template>
    <div :class="cx('root')" role="presentation" v-bind="ptmi('root')">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseTabPanels from './BaseTabPanels.vue';

export default defineComponent({
    name: 'TabPanels',
    extends: BaseTabPanels,
    inheritAttrs: false
});
</script>
