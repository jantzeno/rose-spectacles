import type { VNode } from 'vue';

export interface EmptyStateProps {
    title: string;
    description?: string;
    heading?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export interface EmptyStateSlots {
    icon?(): VNode[];
    default?(): VNode[];
    actions?(): VNode[];
}
