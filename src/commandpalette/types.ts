import type { Component, VNode } from 'vue';

export interface CommandPaletteItem {
    id: string;
    label: string;
    description?: string;
    group?: string;
    keywords?: readonly string[];
    shortcut?: string;
    icon?: Component;
    disabled?: boolean;
}

export interface CommandPaletteProps {
    items: readonly CommandPaletteItem[];
    visible?: boolean;
    query?: string;
    title?: string;
    placeholder?: string;
    emptyMessage?: string;
    loading?: boolean;
    filterLocally?: boolean;
    shortcut?: boolean;
}

export interface CommandPaletteSlots {
    item?(scope: { item: CommandPaletteItem; active: boolean }): VNode[];
    empty?(): VNode[];
}

export interface CommandPaletteEmits {
    'update:visible': [value: boolean];
    'update:query': [value: string];
    select: [item: CommandPaletteItem];
}
