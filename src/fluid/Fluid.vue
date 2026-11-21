<template>
    <div :class="cx('root')" v-bind="ptmi('root')">
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseFluid from './BaseFluid.vue';

export default defineComponent({
    name: 'Fluid',
    extends: BaseFluid,
    inheritAttrs: false
});
</script>
