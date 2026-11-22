import type { DefineComponent, EmitFn } from 'rose-spectacles/core';
import type { AttachmentItemProps, AttachmentItemSlots, AttachmentItemEmits } from './types';

export type * from './types';

type AttachmentItemEventHandlers = { [K in keyof AttachmentItemEmits]: (...args: AttachmentItemEmits[K]) => void };

declare const AttachmentItem: DefineComponent<AttachmentItemProps, AttachmentItemSlots, EmitFn<AttachmentItemEventHandlers>>;

declare module 'vue' {
    export interface GlobalComponents {
        AttachmentItem: typeof AttachmentItem;
    }
}

export default AttachmentItem;
