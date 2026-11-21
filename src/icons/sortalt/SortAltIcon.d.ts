import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class SortAltIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        SortAltIcon: DefineComponent<SortAltIcon>;
    }
}

export default SortAltIcon;
