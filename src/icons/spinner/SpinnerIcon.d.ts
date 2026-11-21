import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class SpinnerIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        SpinnerIcon: DefineComponent<SpinnerIcon>;
    }
}

export default SpinnerIcon;
