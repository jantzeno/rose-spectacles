import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class UploadIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        UploadIcon: DefineComponent<UploadIcon>;
    }
}

export default UploadIcon;
