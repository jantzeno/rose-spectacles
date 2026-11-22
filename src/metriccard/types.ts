import type { VNode } from 'vue';

export interface MetricCardTrend {
    label: string;
    direction: 'up' | 'down' | 'flat';
    tone?: 'positive' | 'negative' | 'neutral';
}

export interface MetricCardProps {
    label: string;
    value: string | number;
    description?: string;
    trend?: MetricCardTrend;
}

export interface MetricCardSlots {
    icon?(): VNode[];
    chart?(): VNode[];
}
