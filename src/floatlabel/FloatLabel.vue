<template>
    <span :class="cx('root')" v-bind="ptmi('root')">
        <slot />
    </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseFloatLabel from './BaseFloatLabel.vue';

export default defineComponent({
    name: 'FloatLabel',
    extends: BaseFloatLabel,
    inheritAttrs: false
});
</script>
