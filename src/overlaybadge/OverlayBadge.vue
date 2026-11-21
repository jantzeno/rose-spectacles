<template>
    <div :class="cx('root')" v-bind="ptmi('root')">
        <slot />
        <Badge v-bind="$props" :pt="ptm('pcBadge')" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Badge from '../badge/Badge.vue';
import BaseOverlayBadge from './BaseOverlayBadge.vue';

export default defineComponent({
    name: 'OverlayBadge',
    extends: BaseOverlayBadge,
    inheritAttrs: false,
    components: {
        Badge
    }
});
</script>
