import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class BlankIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        BlankIcon: DefineComponent<BlankIcon>;
    }
}

export default BlankIcon;
