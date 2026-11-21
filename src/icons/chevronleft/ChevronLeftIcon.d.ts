import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class ChevronLeftIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        ChevronLeftIcon: DefineComponent<ChevronLeftIcon>;
    }
}

export default ChevronLeftIcon;
