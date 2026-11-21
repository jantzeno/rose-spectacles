import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class TrashIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        TrashIcon: DefineComponent<TrashIcon>;
    }
}

export default TrashIcon;
