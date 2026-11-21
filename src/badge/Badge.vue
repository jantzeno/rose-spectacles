<template>
    <span :class="cx('root')" :data-p="dataP" v-bind="ptmi('root')">
        <slot>{{ value }}</slot>
    </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { cn } from '../internal/utils/index';
import BaseBadge from './BaseBadge.vue';

export default defineComponent({
    name: 'Badge',
    extends: BaseBadge,
    inheritAttrs: false,
    computed: {
        dataP() {
            return cn({
                circle: this.value != null && String(this.value).length === 1,
                empty: this.value == null && !this.$slots.default,
                [this.severity]: this.severity,
                [this.size]: this.size
            });
        }
    }
});
</script>
