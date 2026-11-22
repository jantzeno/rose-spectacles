<script setup lang="ts">
import { Inbox } from '@lucide/vue';
import { useId } from 'vue';
import type { EmptyStateProps, EmptyStateSlots } from './types';

defineOptions({ name: 'EmptyState' });
withDefaults(defineProps<EmptyStateProps>(), { heading: 'h2' });
defineSlots<EmptyStateSlots>();

const id = useId();
</script>

<template>
    <section class="rs-empty-state" :aria-labelledby="id" :aria-describedby="description ? id + '-description' : undefined">
        <div class="rs-empty-state-icon" aria-hidden="true">
            <slot name="icon"><Inbox :size="24" /></slot>
        </div>
        <component :is="heading" :id="id" class="rs-empty-state-title">{{ title }}</component>
        <p v-if="description" :id="id + '-description'" class="rs-empty-state-description">{{ description }}</p>
        <slot />
        <div v-if="$slots.actions" class="rs-empty-state-actions">
            <slot name="actions" />
        </div>
    </section>
</template>

<style>
.rs-empty-state {
    display: grid;
    justify-items: center;
    gap: 0.6rem;
    padding: clamp(1.5rem, 5vw, 3.5rem) 1rem;
    text-align: center;
}
.rs-empty-state-icon {
    display: grid;
    place-items: center;
    width: 3rem;
    height: 3rem;
    border-radius: 0.85rem;
    background: color-mix(in srgb, currentColor 8%, transparent);
}
.rs-empty-state-title {
    margin: 0.2rem 0 0;
    font-size: 1.125rem;
    line-height: 1.4;
}
.rs-empty-state-description {
    max-width: 38ch;
    margin: 0;
    color: var(--rs-text-muted-color, inherit);
}
.rs-empty-state-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.6rem;
    margin-top: 0.45rem;
}
</style>
