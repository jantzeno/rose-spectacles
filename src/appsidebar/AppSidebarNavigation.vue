<script setup lang="ts">
import { Circle } from '@lucide/vue';
import Button from '../button/Button.vue';
import type { AppSidebarGroup, AppSidebarItem } from './types';

defineProps<{ groups: readonly AppSidebarGroup[]; activeId?: string; compact?: boolean; navigationLabel: string }>();
const emit = defineEmits<{ select: [item: AppSidebarItem] }>();

function activate(event: MouseEvent, item: AppSidebarItem) {
    if (item.disabled || (item.href && (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey))) return;
    emit('select', item);
}
</script>

<template>
    <nav class="rs-app-sidebar-nav" :aria-label="navigationLabel" :data-compact="compact || undefined">
        <div v-for="(group, index) in groups" :key="index" class="rs-app-sidebar-group">
            <div v-if="group.label" class="rs-app-sidebar-group-label">{{ group.label }}</div>
            <ul :aria-label="group.label">
                <li v-for="item in group.items" :key="item.id">
                    <Button
                        :as="item.href && !item.disabled ? 'a' : 'button'"
                        :href="item.disabled ? undefined : item.href"
                        :disabled="item.disabled"
                        :aria-current="activeId === item.id ? 'page' : undefined"
                        :aria-label="compact ? item.label : undefined"
                        :title="compact ? item.label : undefined"
                        class="rs-app-sidebar-link"
                        text
                        @click="activate($event, item)"
                    >
                        <component v-if="item.icon || compact" :is="item.icon ?? Circle" :size="18" aria-hidden="true" />
                        <span v-if="!compact">{{ item.label }}</span>
                    </Button>
                </li>
            </ul>
        </div>
    </nav>
</template>
