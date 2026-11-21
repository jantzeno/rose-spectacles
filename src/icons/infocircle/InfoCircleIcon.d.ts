import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class InfoCircleIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        InfoCircleIcon: DefineComponent<InfoCircleIcon>;
    }
}

export default InfoCircleIcon;
