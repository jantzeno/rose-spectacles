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
        <div class="rs-empty-state-heading">
            <component :is="heading" :id="id" class="rs-empty-state-title">{{ title }}</component>
            <p v-if="description" :id="id + '-description'" class="rs-empty-state-description">{{ description }}</p>
        </div>
        <div v-if="$slots.default" class="rs-empty-state-content"><slot /></div>
        <div v-if="$slots.actions" class="rs-empty-state-actions">
            <slot name="actions" />
        </div>
    </section>
</template>

<style>
.rs-empty-state {
    display: grid;
    justify-items: center;
    gap: 0.9rem;
    padding: clamp(1.5rem, 4vw, 2.75rem) 1rem;
    overflow-wrap: anywhere;
    text-align: center;
}
.rs-empty-state-icon {
    display: grid;
    place-items: center;
    width: 3rem;
    height: 3rem;
    border: 1px solid var(--rs-content-border-color, color-mix(in srgb, currentColor 18%, transparent));
    border-radius: 0.75rem;
    background: var(--rs-content-hover-background, color-mix(in srgb, currentColor 6%, transparent));
}
.rs-empty-state-heading {
    display: grid;
    justify-items: center;
    gap: 0.35rem;
}
.rs-empty-state-title {
    margin: 0;
    font-size: 1.25rem;
    line-height: 1.3;
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
    margin-top: 0.15rem;
}
</style>
