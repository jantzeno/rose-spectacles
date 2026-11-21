import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class ThLargeIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        ThLargeIcon: DefineComponent<ThLargeIcon>;
    }
}

export default ThLargeIcon;
