<script setup lang="ts">
import { Search } from '@lucide/vue';
import { computed, nextTick, onMounted, onUnmounted, ref, useId, watch } from 'vue';
import Dialog from '../dialog/Dialog.vue';
import IconField from '../iconfield/IconField.vue';
import InputIcon from '../inputicon/InputIcon.vue';
import InputText from '../inputtext/InputText.vue';
import type { CommandPaletteEmits, CommandPaletteItem, CommandPaletteProps, CommandPaletteSlots } from './types';

defineOptions({ name: 'CommandPalette' });
const props = withDefaults(defineProps<Omit<CommandPaletteProps, 'visible' | 'query'>>(), {
    title: 'Command palette',
    placeholder: 'Search commands',
    emptyMessage: 'No matching commands.',
    filterLocally: true
});
defineSlots<CommandPaletteSlots>();
const emit = defineEmits<Pick<CommandPaletteEmits, 'select'>>();

const visible = defineModel<boolean>('visible', { default: false });
const query = defineModel<string>('query', { default: '' });
const listId = useId() + '-commands';
const activeId = ref<string>();

const groups = computed(() => {
    const result = new Map<string, CommandPaletteItem[]>();
    if (props.loading) return result;

    const terms = query.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
    for (const item of props.items) {
        if (props.filterLocally && terms.length) {
            const text = [item.label, item.description, item.group, ...(item.keywords ?? [])].join(' ').toLocaleLowerCase();
            if (!terms.every((term) => text.includes(term))) continue;
        }

        const group = item.group ?? '';
        const items = result.get(group);
        if (items) items.push(item);
        else result.set(group, [item]);
    }

    return result;
});

const enabledItems = computed(() =>
    Array.from(groups.value.values())
        .flat()
        .filter((item) => !item.disabled)
);
const active = computed(() => enabledItems.value.find((item) => item.id === activeId.value));

watch(
    enabledItems,
    (items) => {
        if (!items.some((item) => item.id === activeId.value)) activeId.value = items[0]?.id;
    },
    { immediate: true }
);

function optionId(id: string) {
    return listId + '-' + encodeURIComponent(id);
}

function select(item: CommandPaletteItem) {
    if (item.disabled) return;
    visible.value = false;
    emit('select', item);
}

function onInputKeydown(event: KeyboardEvent) {
    if (event.isComposing) return;

    if (event.key === 'Enter' && active.value) {
        event.preventDefault();
        select(active.value);
        return;
    }

    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const items = enabledItems.value;
    if (!items.length) return;

    event.preventDefault();
    const index = items.findIndex((item) => item.id === activeId.value);
    const next = index < 0 ? (event.key === 'ArrowDown' ? 0 : items.length - 1) : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
    const id = items[next].id;
    activeId.value = id;
    void nextTick(() => document.getElementById(optionId(id))?.scrollIntoView?.({ block: 'nearest' }));
}

function onShortcut(event: KeyboardEvent) {
    if (!props.shortcut || event.defaultPrevented || event.repeat || event.isComposing || event.altKey || event.shiftKey) return;
    if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') return;
    event.preventDefault();
    visible.value = true;
}

onMounted(() => window.addEventListener('keydown', onShortcut));
onUnmounted(() => window.removeEventListener('keydown', onShortcut));
</script>

<template>
    <Dialog v-model:visible="visible" :header="title" class="rs-command-palette" :modal="true" :block-scroll="true">
        <div class="rs-command-palette-toolbar">
            <IconField class="rs-command-palette-search">
                <InputIcon><Search :size="18" aria-hidden="true" /></InputIcon>
                <InputText
                    v-model="query"
                    role="combobox"
                    :aria-label="placeholder"
                    :placeholder="placeholder"
                    :aria-controls="listId"
                    :aria-expanded="true"
                    :aria-activedescendant="active && optionId(active.id)"
                    aria-autocomplete="list"
                    autocomplete="off"
                    autofocus
                    @keydown="onInputKeydown"
                />
            </IconField>
        </div>

        <div v-if="loading" class="rs-command-palette-status" role="status">Searching…</div>
        <div v-else-if="!groups.size" class="rs-command-palette-status" role="status"><slot name="empty">{{ emptyMessage }}</slot></div>

        <div :id="listId" class="rs-command-palette-list" role="listbox" :aria-label="title" :aria-busy="loading || undefined">
            <div v-for="[group, entries] in groups" :key="group" role="group" :aria-label="group || 'Commands'">
                <p v-if="group" class="rs-command-palette-group" aria-hidden="true">{{ group }}</p>
                <div
                    v-for="item in entries"
                    :id="optionId(item.id)"
                    :key="item.id"
                    class="rs-command-palette-item"
                    role="option"
                    :aria-selected="active?.id === item.id"
                    :aria-disabled="item.disabled || undefined"
                    @mousemove="!item.disabled && (activeId = item.id)"
                    @mousedown.prevent
                    @click="select(item)"
                >
                    <slot name="item" :item="item" :active="active?.id === item.id">
                        <component v-if="item.icon" :is="item.icon" :size="18" aria-hidden="true" />
                        <span class="rs-command-palette-item-body">
                            <span>{{ item.label }}</span>
                            <small v-if="item.description">{{ item.description }}</small>
                        </span>
                        <kbd v-if="item.shortcut">{{ item.shortcut }}</kbd>
                    </slot>
                </div>
            </div>
        </div>
    </Dialog>
</template>

<style>
.rs-command-palette {
    width: min(34rem, calc(100vw - 2rem));
}
.rs-command-palette-toolbar {
    padding-block-end: 0.75rem;
    border-block-end: 1px solid var(--rs-content-border-color, color-mix(in srgb, currentColor 16%, transparent));
}
.rs-command-palette-search.rs-iconfield .rs-inputtext {
    width: 100%;
}
.rs-command-palette-list {
    max-height: min(23rem, 50vh);
    margin-top: 0.5rem;
    overflow: auto;
}
.rs-command-palette-list [role='group'] + [role='group'] {
    margin-block-start: 0.55rem;
    padding-block-start: 0.45rem;
    border-block-start: 1px solid var(--rs-content-border-color, color-mix(in srgb, currentColor 14%, transparent));
}
.rs-command-palette-group {
    margin: 0.6rem 0.55rem 0.25rem;
    color: var(--rs-text-muted-color, inherit);
    font-size: 0.75rem;
    font-weight: 650;
}
.rs-command-palette-item {
    display: flex;
    gap: 0.65rem;
    align-items: center;
    min-height: 2.75rem;
    padding: 0.5rem 0.65rem;
    border-radius: 0.45rem;
    cursor: pointer;
}
.rs-command-palette-item[aria-selected='true'] {
    background: var(--rs-command-palette-active-background, var(--rs-highlight-background, color-mix(in srgb, currentColor 10%, transparent)));
    color: var(--rs-highlight-color, inherit);
}
.rs-command-palette-item[aria-disabled='true'] {
    opacity: 0.55;
    cursor: default;
}
.rs-command-palette-item-body {
    display: grid;
    flex: 1;
    min-width: 0;
    gap: 0.1rem;
    overflow-wrap: anywhere;
}
.rs-command-palette-item-body > span {
    font-weight: 550;
}
.rs-command-palette-item small,
.rs-command-palette-status {
    color: var(--rs-text-muted-color, inherit);
}
.rs-command-palette-item kbd {
    padding: 0.05rem 0.35rem;
    border: 1px solid var(--rs-content-border-color, color-mix(in srgb, currentColor 20%, transparent));
    border-radius: 0.3rem;
    font-size: 0.75rem;
}
.rs-command-palette-status {
    margin: 0.9rem 0.5rem;
}
</style>
