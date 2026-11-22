import type { DefineComponent } from 'rose-spectacles/core';
import type { EmptyStateProps, EmptyStateSlots } from './types';

export type * from './types';

declare const EmptyState: DefineComponent<EmptyStateProps, EmptyStateSlots>;

declare module 'vue' {
    export interface GlobalComponents {
        EmptyState: typeof EmptyState;
    }
}

export default EmptyState;
