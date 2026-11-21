import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class PlusIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        PlusIcon: DefineComponent<PlusIcon>;
    }
}

export default PlusIcon;
