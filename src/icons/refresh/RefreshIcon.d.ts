import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class RefreshIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        RefreshIcon: DefineComponent<RefreshIcon>;
    }
}

export default RefreshIcon;
