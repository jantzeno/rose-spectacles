import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class ExclamationTriangleIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        ExclamationTriangleIcon: DefineComponent<ExclamationTriangleIcon>;
    }
}

export default ExclamationTriangleIcon;
