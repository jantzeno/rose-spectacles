import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class ArrowUpIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        ArrowUpIcon: DefineComponent<ArrowUpIcon>;
    }
}

export default ArrowUpIcon;
