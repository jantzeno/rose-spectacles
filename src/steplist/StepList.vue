<template>
    <div :class="cx('root')" v-bind="ptmi('root')">
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseStepList from './BaseStepList.vue';

export default defineComponent({
    name: 'StepList',
    extends: BaseStepList,
    inheritAttrs: false
});
</script>
