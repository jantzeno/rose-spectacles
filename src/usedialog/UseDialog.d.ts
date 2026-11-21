import type { DynamicDialogInstance, DynamicDialogOptions } from 'rose-spectacles/dynamicdialogoptions';

export declare function useDialog(): {
    open: (content: any, options?: DynamicDialogOptions) => DynamicDialogInstance;
};
