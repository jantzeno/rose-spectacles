<template>
    <span :class="containerClass" v-bind="ptmi('root')" aria-hidden="true">
        <slot />
    </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseInputIcon from './BaseInputIcon.vue';

export default defineComponent({
    name: 'InputIcon',
    extends: BaseInputIcon,
    inheritAttrs: false,
    computed: {
        containerClass() {
            return [this.cx('root'), this.class];
        }
    }
});
</script>
