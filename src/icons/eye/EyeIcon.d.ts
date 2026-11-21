import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class EyeIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        EyeIcon: DefineComponent<EyeIcon>;
    }
}

export default EyeIcon;
