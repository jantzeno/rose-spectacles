import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class CheckIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        CheckIcon: DefineComponent<CheckIcon>;
    }
}

export default CheckIcon;
