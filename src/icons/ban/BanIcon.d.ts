import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class BanIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        BanIcon: DefineComponent<BanIcon>;
    }
}

export default BanIcon;
