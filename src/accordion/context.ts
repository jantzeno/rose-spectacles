import type { Slots } from 'vue';

export type AccordionKey = string | number;

export interface AccordionContext {
    $el: HTMLElement;
    $id: string;
    $slots: Slots;
    selectOnFocus: boolean;
    tabindex: number;
    lazy: boolean;
    collapseIcon?: string;
    expandIcon?: string;
    isItemActive(value?: AccordionKey): boolean | undefined;
    updateValue(value?: AccordionKey): void;
}

export interface AccordionPanelContext {
    active: boolean | undefined;
    value?: AccordionKey;
    disabled: boolean;
}
