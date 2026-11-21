import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class StarFillIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        StarFillIcon: DefineComponent<StarFillIcon>;
    }
}

export default StarFillIcon;
