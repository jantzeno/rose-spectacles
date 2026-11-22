<script setup lang="ts">
import { ArrowDownRight, ArrowRight, ArrowUpRight } from '@lucide/vue';
import { useId } from 'vue';
import Card from '../card/Card.vue';
import type { MetricCardProps, MetricCardSlots } from './types';

defineOptions({ name: 'MetricCard' });
defineProps<MetricCardProps>();
defineSlots<MetricCardSlots>();

const id = useId();
const directionIcons = { up: ArrowUpRight, down: ArrowDownRight, flat: ArrowRight };
</script>

<template>
    <Card class="rs-metric-card" role="group" :aria-labelledby="id">
        <template #content>
            <div class="rs-metric-card-top">
                <div :id="id" class="rs-metric-card-label">{{ label }}</div>
                <div v-if="$slots.icon" class="rs-metric-card-icon" aria-hidden="true">
                    <slot name="icon" />
                </div>
            </div>
            <div class="rs-metric-card-value">{{ value }}</div>
            <div v-if="trend || description" class="rs-metric-card-context">
                <span v-if="trend" class="rs-metric-card-trend" :data-tone="trend.tone ?? 'neutral'">
                    <component :is="directionIcons[trend.direction]" :size="16" aria-hidden="true" />
                    {{ trend.label }}
                </span>
                <span v-if="description">{{ description }}</span>
            </div>
            <div v-if="$slots.chart" class="rs-metric-card-chart"><slot name="chart" /></div>
        </template>
    </Card>
</template>

<style>
.rs-metric-card {
    min-width: 0;
}
.rs-metric-card-top,
.rs-metric-card-context,
.rs-metric-card-trend {
    display: flex;
    align-items: center;
    gap: 0.45rem;
}
.rs-metric-card-top {
    justify-content: space-between;
}
.rs-metric-card-label,
.rs-metric-card-context {
    font-size: 0.875rem;
    color: var(--rs-text-muted-color, inherit);
}
.rs-metric-card-icon {
    display: inline-grid;
    place-items: center;
    padding: 0.55rem;
    border-radius: 0.6rem;
    background: color-mix(in srgb, currentColor 8%, transparent);
}
.rs-metric-card-value {
    margin-block: 0.35rem;
    font-size: clamp(1.65rem, 4vw, 2.6rem);
    font-weight: 650;
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
}
.rs-metric-card-context {
    flex-wrap: wrap;
}
.rs-metric-card-trend {
    font-weight: 650;
}
.rs-metric-card-trend[data-tone='positive'] {
    color: var(--rs-metric-card-positive-color, light-dark(#22613d, #8bd5a6));
}
.rs-metric-card-trend[data-tone='negative'] {
    color: var(--rs-metric-card-negative-color, light-dark(#a12c42, #ffa1b1));
}
.rs-metric-card-chart {
    min-width: 0;
    margin-top: 0.85rem;
}
</style>
