<template>
    <div :class="cx('root')" v-bind="ptmi('root')">
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseIconField from './BaseIconField.vue';

export default defineComponent({
    name: 'IconField',
    extends: BaseIconField,
    inheritAttrs: false
});
</script>
