<template>
    <div :class="cx('root')" :style="sx('root')" role="separator" :aria-orientation="layout" :data-p="dataP" v-bind="ptmi('root')">
        <div v-if="$slots.default" :class="cx('content')" :data-p="dataP" v-bind="ptm('content')">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { cn } from '../internal/utils/index';
import BaseDivider from './BaseDivider.vue';

export default defineComponent({
    name: 'Divider',
    extends: BaseDivider,
    inheritAttrs: false,
    computed: {
        dataP() {
            return cn({
                [this.align]: this.align,
                [this.layout]: this.layout,
                [this.type]: this.type
            });
        }
    }
});
</script>
