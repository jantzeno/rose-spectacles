import type { VNode } from 'vue';

export type AttachmentItemStatus = 'pending' | 'uploading' | 'ready' | 'error';

export interface AttachmentItemProps {
    name: string;
    size?: number;
    url?: string;
    thumbnail?: string;
    status?: AttachmentItemStatus;
    progress?: number;
    error?: string;
    removable?: boolean;
    retryable?: boolean;
}

export interface AttachmentItemSlots {
    icon?(): VNode[];
    actions?(): VNode[];
}

export interface AttachmentItemEmits {
    remove: [];
    retry: [];
}
