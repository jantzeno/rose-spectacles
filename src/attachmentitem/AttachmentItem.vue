<script setup lang="ts">
import { Download, File, RotateCcw, X } from '@lucide/vue';
import { computed } from 'vue';
import Badge from '../badge/Badge.vue';
import Button from '../button/Button.vue';
import ProgressBar from '../progressbar/ProgressBar.vue';
import type { AttachmentItemEmits, AttachmentItemProps, AttachmentItemSlots } from './types';

defineOptions({ name: 'AttachmentItem' });
const props = withDefaults(defineProps<AttachmentItemProps>(), { status: 'ready' });
defineSlots<AttachmentItemSlots>();
const emit = defineEmits<AttachmentItemEmits>();

const statuses = {
    pending: { label: 'Queued', severity: 'secondary' },
    uploading: { label: 'Uploading', severity: 'info' },
    ready: { label: 'Ready', severity: 'success' },
    error: { label: 'Upload failed', severity: 'danger' }
} as const;

const fileSize = computed(() => {
    const bytes = props.size;
    if (bytes === undefined || !Number.isFinite(bytes) || bytes < 0) return;
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 ** 2) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 ** 3) return (bytes / 1024 ** 2).toFixed(1) + ' MB';
    return (bytes / 1024 ** 3).toFixed(1) + ' GB';
});

const progressValue = computed(() =>
    props.progress !== undefined && Number.isFinite(props.progress) ? Math.min(100, Math.max(0, props.progress)) : undefined
);
</script>

<template>
    <div class="rs-attachment-item">
        <span class="rs-attachment-item-preview" aria-hidden="true">
            <slot name="icon">
                <img v-if="thumbnail" :src="thumbnail" alt="" />
                <File v-else :size="20" />
            </slot>
        </span>
        <div class="rs-attachment-item-content">
            <div class="rs-attachment-item-name">{{ name }}</div>
            <div class="rs-attachment-item-meta">
                <span v-if="fileSize">{{ fileSize }}</span>
                <span aria-live="polite"><Badge :value="statuses[status].label" :severity="statuses[status].severity" /></span>
            </div>
            <p v-if="status === 'error' && error" class="rs-attachment-item-error">{{ error }}</p>
            <ProgressBar
                v-if="status === 'uploading'"
                class="rs-attachment-item-progress"
                :mode="progressValue === undefined ? 'indeterminate' : 'determinate'"
                :value="progressValue"
                :show-value="false"
                :aria-label="'Uploading ' + name"
            />
        </div>
        <div v-if="(status === 'ready' && url) || (status === 'error' && retryable) || removable || $slots.actions" class="rs-attachment-item-actions">
            <Button v-if="status === 'ready' && url" as="a" :href="url" :download="name" text :aria-label="'Download ' + name">
                <template #icon><Download :size="17" aria-hidden="true" /></template>
            </Button>
            <Button v-if="status === 'error' && retryable" text :aria-label="'Retry ' + name" @click="emit('retry')">
                <template #icon><RotateCcw :size="17" aria-hidden="true" /></template>
            </Button>
            <Button v-if="removable" text :aria-label="'Remove ' + name" @click="emit('remove')">
                <template #icon><X :size="17" aria-hidden="true" /></template>
            </Button>
            <slot name="actions" />
        </div>
    </div>
</template>

<style>
.rs-attachment-item {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.8rem;
    border: 1px solid var(--rs-content-border-color, color-mix(in srgb, currentColor 18%, transparent));
    border-radius: 0.7rem;
}
.rs-attachment-item-preview {
    display: grid;
    place-items: center;
    flex: none;
    width: 2.65rem;
    height: 2.65rem;
    overflow: hidden;
    border-radius: 0.55rem;
    background: color-mix(in srgb, currentColor 8%, transparent);
}
.rs-attachment-item-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.rs-attachment-item-content {
    flex: 1 1 8rem;
    min-width: 0;
}
.rs-attachment-item-name {
    font-weight: 600;
    overflow-wrap: anywhere;
}
.rs-attachment-item-meta,
.rs-attachment-item-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.45rem;
}
.rs-attachment-item-meta,
.rs-attachment-item-error {
    margin: 0.25rem 0 0;
    font-size: 0.8rem;
}
.rs-attachment-item-actions {
    margin-inline-start: auto;
}
.rs-attachment-item-progress {
    margin-top: 0.45rem;
}
</style>
