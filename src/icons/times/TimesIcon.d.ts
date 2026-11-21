import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class TimesIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        TimesIcon: DefineComponent<TimesIcon>;
    }
}

export default TimesIcon;
