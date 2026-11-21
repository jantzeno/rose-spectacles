import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class EyeSlashIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        EyeSlashIcon: DefineComponent<EyeSlashIcon>;
    }
}

export default EyeSlashIcon;
