import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class TimesCircleIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        TimesCircleIcon: DefineComponent<TimesCircleIcon>;
    }
}

export default TimesCircleIcon;
