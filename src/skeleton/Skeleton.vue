<template>
    <div :class="cx('root')" :style="[sx('root'), containerStyle]" aria-hidden="true" v-bind="ptmi('root')" :data-p="dataP"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { cn } from '../internal/utils/index';
import BaseSkeleton from './BaseSkeleton.vue';

export default defineComponent({
    name: 'Skeleton',
    extends: BaseSkeleton,
    inheritAttrs: false,
    computed: {
        containerStyle() {
            if (this.size) return { width: this.size, height: this.size, borderRadius: this.borderRadius };
            else return { width: this.width, height: this.height, borderRadius: this.borderRadius };
        },
        dataP() {
            return cn({
                [this.shape]: this.shape
            });
        }
    }
});
</script>
