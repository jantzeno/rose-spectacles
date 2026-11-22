import type { Component, VNode } from 'vue';

export interface AppSidebarItem {
    id: string;
    label: string;
    icon?: Component;
    href?: string;
    disabled?: boolean;
}

export interface AppSidebarGroup {
    label?: string;
    items: readonly AppSidebarItem[];
}

export interface AppSidebarProps {
    groups: readonly AppSidebarGroup[];
    title?: string;
    navigationLabel?: string;
    activeId?: string;
    collapsed?: boolean;
}

export interface AppSidebarSlots {
    header?(): VNode[];
    footer?(): VNode[];
    default?(): VNode[];
}

export interface AppSidebarEmits {
    'update:activeId': [value: string];
    'update:collapsed': [value: boolean];
    select: [item: AppSidebarItem];
}
