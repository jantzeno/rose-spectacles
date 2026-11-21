<template>
    <div :class="cx('root')" v-bind="ptmi('root')">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseAvatarGroup from './BaseAvatarGroup.vue';

export default defineComponent({
    name: 'AvatarGroup',
    extends: BaseAvatarGroup,
    inheritAttrs: false
});
</script>
