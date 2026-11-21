import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class ChevronUpIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        ChevronUpIcon: DefineComponent<ChevronUpIcon>;
    }
}

export default ChevronUpIcon;
