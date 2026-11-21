import type { ConfirmationOptions } from 'rose-spectacles/confirmationoptions';
import type Button from '../button/Button.vue';

type ButtonProps = InstanceType<typeof Button>['$props'];

export type ConfirmationRenderOptions = ConfirmationOptions & {
    acceptProps?: ButtonProps;
    rejectProps?: ButtonProps;
    closeOnEscape?: boolean;
};
