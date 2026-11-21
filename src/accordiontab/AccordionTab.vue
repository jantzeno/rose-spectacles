<template>
    <slot></slot>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseAccordionTab from './BaseAccordionTab.vue';

export default defineComponent({
    name: 'AccordionTab',
    extends: BaseAccordionTab,
    inheritAttrs: false,
    mounted() {
        console.warn('Deprecated since v4. Use the new structure of Accordion instead.');
    }
});
</script>
