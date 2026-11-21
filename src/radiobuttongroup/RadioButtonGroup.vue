<template>
    <div :class="cx('root')" v-bind="ptmi('root')">
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { uuid } from '../internal/utils/index';
import BaseRadioButtonGroup from './BaseRadioButtonGroup.vue';

export default defineComponent({
    name: 'RadioButtonGroup',
    extends: BaseRadioButtonGroup,
    inheritAttrs: false,
    data() {
        return {
            groupName: this.name
        };
    },
    watch: {
        name(newValue) {
            this.groupName = newValue || uuid('radiobutton-group-');
        }
    },
    mounted() {
        this.groupName = this.groupName || uuid('radiobutton-group-');
    }
});
</script>
