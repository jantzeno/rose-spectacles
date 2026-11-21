import type { Slots } from 'vue';

export type TabValue = string | number;

export interface TabsContext {
    $id: string;
    $slots: Slots;
    d_value?: TabValue;
    lazy: boolean;
    orientation?: 'horizontal' | 'vertical';
    scrollable: boolean;
    selectOnFocus: boolean;
    showNavigators: boolean;
    tabindex: number;
    isVertical(): boolean;
    updateValue(value?: TabValue): void;
}
