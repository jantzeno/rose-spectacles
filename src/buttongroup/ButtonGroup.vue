<template>
    <span :class="cx('root')" role="group" v-bind="ptmi('root')">
        <slot />
    </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseButtonGroup from './BaseButtonGroup.vue';

export default defineComponent({
    name: 'ButtonGroup',
    extends: BaseButtonGroup,
    inheritAttrs: false
});
</script>
