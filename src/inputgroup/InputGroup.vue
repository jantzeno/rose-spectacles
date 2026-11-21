<template>
    <div :class="cx('root')" v-bind="ptmi('root')">
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseInputGroup from './BaseInputGroup.vue';

export default defineComponent({
    name: 'InputGroup',
    extends: BaseInputGroup,
    inheritAttrs: false
});
</script>
