<script setup lang="ts">
import { Menu, PanelLeftClose, PanelLeftOpen } from '@lucide/vue';
import { onMounted, onUnmounted, ref, useId, useTemplateRef, type ComponentPublicInstance } from 'vue';
import Button from '../button/Button.vue';
import Drawer from '../drawer/Drawer.vue';
import AppSidebarNavigation from './AppSidebarNavigation.vue';
import type { AppSidebarEmits, AppSidebarItem, AppSidebarProps, AppSidebarSlots } from './types';

defineOptions({ name: 'AppSidebar' });
withDefaults(defineProps<Omit<AppSidebarProps, 'activeId' | 'collapsed'>>(), { title: 'Workspace', navigationLabel: 'Workspace navigation' });
defineSlots<AppSidebarSlots>();
const emit = defineEmits<Pick<AppSidebarEmits, 'select'>>();
const activeId = defineModel<string>('activeId');
const collapsed = defineModel<boolean>('collapsed', { default: false });

const id = useId();
const mobileOpen = ref(false);
const mobileTrigger = useTemplateRef<ComponentPublicInstance>('mobileTrigger');
let mobileViewport: MediaQueryList | undefined;

function closeOnDesktop(event: MediaQueryListEvent) {
    if (!event.matches) mobileOpen.value = false;
}

onMounted(() => {
    mobileViewport = window.matchMedia?.('(max-width: 48rem)');
    mobileViewport?.addEventListener('change', closeOnDesktop);
});

onUnmounted(() => mobileViewport?.removeEventListener('change', closeOnDesktop));

function select(item: AppSidebarItem) {
    activeId.value = item.id;
    mobileOpen.value = false;
    emit('select', item);
}

function restoreMobileFocus() {
    if (!mobileViewport || mobileViewport.matches) (mobileTrigger.value?.$el as HTMLElement | undefined)?.focus();
}
</script>

<template>
    <div class="rs-app-sidebar" :data-collapsed="collapsed || undefined">
        <aside class="rs-app-sidebar-desktop">
            <div class="rs-app-sidebar-header">
                <div v-show="!collapsed" class="rs-app-sidebar-heading"><slot name="header">{{ title }}</slot></div>
                <Button
                    text
                    :aria-label="collapsed ? 'Expand navigation' : 'Collapse navigation'"
                    :aria-expanded="!collapsed"
                    :aria-controls="id + '-desktop'"
                    @click="collapsed = !collapsed"
                >
                    <template #icon><component :is="collapsed ? PanelLeftOpen : PanelLeftClose" :size="18" aria-hidden="true" /></template>
                </Button>
            </div>
            <AppSidebarNavigation
                :id="id + '-desktop'"
                :groups="groups"
                :active-id="activeId"
                :compact="collapsed"
                :navigation-label="navigationLabel"
                @select="select"
            />
            <div v-if="$slots.footer && !collapsed" class="rs-app-sidebar-footer"><slot name="footer" /></div>
        </aside>
        <div class="rs-app-sidebar-content">
            <div class="rs-app-sidebar-mobile">
                <Button
                    ref="mobileTrigger"
                    text
                    label="Menu"
                    aria-label="Open navigation"
                    aria-haspopup="dialog"
                    :aria-expanded="mobileOpen"
                    :aria-controls="mobileOpen ? id + '-mobile' : undefined"
                    @click="mobileOpen = true"
                >
                    <template #icon><Menu :size="18" aria-hidden="true" /></template>
                </Button>
            </div>
            <slot />
        </div>
        <Drawer
            :id="id + '-mobile'"
            v-model:visible="mobileOpen"
            class="rs-app-sidebar-drawer"
            :header="title"
            :aria-label="navigationLabel"
            :modal="true"
            :block-scroll="true"
            @after-hide="restoreMobileFocus"
        >
            <template v-if="$slots.header" #header><slot name="header" /></template>
            <AppSidebarNavigation :groups="groups" :active-id="activeId" :navigation-label="navigationLabel" @select="select" />
            <template v-if="$slots.footer" #footer><slot name="footer" /></template>
        </Drawer>
    </div>
</template>

<style>
.rs-app-sidebar {
    display: grid;
    grid-template-columns: minmax(10rem, var(--rs-app-sidebar-width, 14rem)) minmax(0, 1fr);
}
.rs-app-sidebar[data-collapsed] {
    grid-template-columns: 3.75rem minmax(0, 1fr);
}
.rs-app-sidebar-desktop {
    display: flex;
    flex-direction: column;
    min-width: 0;
    background: var(--rs-app-sidebar-background, var(--rs-content-background, Canvas));
    border-inline-end: 1px solid var(--rs-content-border-color, color-mix(in srgb, currentColor 16%, transparent));
    border-radius: 0.5rem 0 0 0.5rem;
}
.rs-app-sidebar-header,
.rs-app-sidebar-footer,
.rs-app-sidebar-mobile {
    padding: 0.6rem;
}
.rs-app-sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.4rem;
    border-block-end: 1px solid var(--rs-content-border-color, color-mix(in srgb, currentColor 16%, transparent));
}
.rs-app-sidebar[data-collapsed] .rs-app-sidebar-header {
    justify-content: center;
    padding-inline: 0.25rem;
}
.rs-app-sidebar-header .rs-button {
    flex-shrink: 0;
}
.rs-app-sidebar-heading {
    min-width: 0;
    padding-inline-start: 0.45rem;
    font-weight: 650;
    overflow-wrap: anywhere;
}
.rs-app-sidebar-footer {
    margin-block-start: auto;
    border-block-start: 1px solid var(--rs-content-border-color, color-mix(in srgb, currentColor 16%, transparent));
}
.rs-app-sidebar-nav {
    display: grid;
    gap: 0.65rem;
    padding: 0.65rem 0.45rem;
}
.rs-app-sidebar-group + .rs-app-sidebar-group {
    padding-block-start: 0.55rem;
    border-block-start: 1px solid var(--rs-content-border-color, color-mix(in srgb, currentColor 12%, transparent));
}
.rs-app-sidebar-group-label {
    padding: 0.2rem 0.65rem 0.35rem;
    color: var(--rs-text-muted-color, inherit);
    font-size: 0.75rem;
    font-weight: 650;
}
.rs-app-sidebar-nav[data-compact] .rs-app-sidebar-group-label {
    display: none;
}
.rs-app-sidebar-nav ul {
    display: grid;
    gap: 0.2rem;
    margin: 0;
    padding: 0;
    list-style: none;
}
.rs-app-sidebar-nav .rs-app-sidebar-link {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0.65rem;
    width: 100%;
    min-height: 2.5rem;
    padding: 0.45rem 0.65rem;
    border: 0;
    background: transparent;
    color: inherit;
    text-align: start;
    text-decoration: none;
    white-space: normal;
    overflow-wrap: anywhere;
}
.rs-app-sidebar-nav .rs-app-sidebar-link svg {
    flex-shrink: 0;
}
.rs-app-sidebar-nav .rs-app-sidebar-link:not(:disabled):hover {
    background: var(--rs-content-hover-background, color-mix(in srgb, currentColor 6%, transparent));
}
.rs-app-sidebar-nav .rs-app-sidebar-link[aria-current='page'],
.rs-app-sidebar-nav .rs-app-sidebar-link[aria-current='page']:hover {
    background: var(--rs-app-sidebar-active-background, var(--rs-highlight-background, color-mix(in srgb, currentColor 10%, transparent)));
    color: var(--rs-highlight-color, inherit);
    border-inline-start: 2px solid var(--rs-primary-color, currentColor);
    padding-inline-start: calc(0.65rem - 2px);
    font-weight: 650;
}
.rs-app-sidebar-nav[data-compact] .rs-app-sidebar-link {
    justify-content: center;
    padding-inline: 0;
}
.rs-app-sidebar-content {
    min-width: 0;
}
.rs-app-sidebar-mobile {
    display: none;
    border-block-end: 1px solid var(--rs-content-border-color, color-mix(in srgb, currentColor 16%, transparent));
}
@media (max-width: 48rem) {
    .rs-app-sidebar,
    .rs-app-sidebar[data-collapsed] {
        grid-template-columns: minmax(0, 1fr);
    }
    .rs-app-sidebar-desktop {
        display: none;
    }
    .rs-app-sidebar-mobile {
        display: block;
    }
}
</style>
