import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class ChevronDownIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        ChevronDownIcon: DefineComponent<ChevronDownIcon>;
    }
}

export default ChevronDownIcon;
