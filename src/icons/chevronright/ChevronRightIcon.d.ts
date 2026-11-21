import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class ChevronRightIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        ChevronRightIcon: DefineComponent<ChevronRightIcon>;
    }
}

export default ChevronRightIcon;
