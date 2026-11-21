import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class AngleLeftIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        AngleLeftIcon: DefineComponent<AngleLeftIcon>;
    }
}

export default AngleLeftIcon;
