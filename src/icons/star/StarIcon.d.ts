import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class StarIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        StarIcon: DefineComponent<StarIcon>;
    }
}

export default StarIcon;
