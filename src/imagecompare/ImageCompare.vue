<template>
    <div :class="cx('root')" :aria-labelledby="ariaLabelledby" :aria-label="ariaLabel" v-bind="ptmi('root')">
        <slot name="left"></slot>
        <slot name="right"></slot>
        <input type="range" min="0" max="100" value="50" @input="onSlide" :class="cx('slider')" v-bind="ptm('slider')" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { $dt } from '../internal/styled/index';
import { setCSSProperty } from '../internal/utils/dom/index';
import BaseImageCompare from './BaseImageCompare.vue';

export default defineComponent({
    name: 'ImageCompare',
    extends: BaseImageCompare,
    methods: {
        onSlide(event: Event) {
            const slider = event.target as HTMLInputElement;
            const value = slider.value;
            const image = slider.previousElementSibling as HTMLElement;

            setCSSProperty(image, $dt('imagecompare.scope.x').name, `${value}%`);
        }
    }
});
</script>
