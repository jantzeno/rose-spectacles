import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class ArrowDownIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        ArrowDownIcon: DefineComponent<ArrowDownIcon>;
    }
}

export default ArrowDownIcon;
