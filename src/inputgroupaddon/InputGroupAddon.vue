<template>
    <div :class="cx('root')" v-bind="ptmi('root')">
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseInputGroupAddon from './BaseInputGroupAddon.vue';

export default defineComponent({
    name: 'InputGroupAddon',
    extends: BaseInputGroupAddon,
    inheritAttrs: false
});
</script>
