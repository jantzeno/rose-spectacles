import type { ConfirmationOptions } from 'rose-spectacles/confirmationoptions';

export declare function useConfirm(): {
    require: (option: ConfirmationOptions) => void;
    close: () => void;
};
