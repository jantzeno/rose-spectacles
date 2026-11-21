<template>
    <span :class="cx('root')" v-bind="ptmi('root')">
        <slot />
    </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseIftaLabel from './BaseIftaLabel.vue';

export default defineComponent({
    name: 'IftaLabel',
    extends: BaseIftaLabel,
    inheritAttrs: false
});
</script>
