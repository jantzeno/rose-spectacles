import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class AngleDownIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        AngleDownIcon: DefineComponent<AngleDownIcon>;
    }
}

export default AngleDownIcon;
