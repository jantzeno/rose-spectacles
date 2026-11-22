import type { DefineComponent } from 'rose-spectacles/core';
import type { MetricCardProps, MetricCardSlots } from './types';

export type * from './types';

declare const MetricCard: DefineComponent<MetricCardProps, MetricCardSlots>;

declare module 'vue' {
    export interface GlobalComponents {
        MetricCard: typeof MetricCard;
    }
}

export default MetricCard;
