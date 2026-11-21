<template>
    <li v-if="grouped" :class="groupClass" role="group" :aria-label="label" :aria-labelledby="labelledby" style="list-style: none">
        <ul role="presentation" style="list-style: none; margin: 0; padding: 0">
            <slot />
        </ul>
    </li>
    <slot v-else />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ListboxOptionGroup',
    props: { grouped: Boolean, groupClass: String, label: String, labelledby: String }
});
</script>
