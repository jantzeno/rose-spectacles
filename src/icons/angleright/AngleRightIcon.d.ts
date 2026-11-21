import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class AngleRightIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        AngleRightIcon: DefineComponent<AngleRightIcon>;
    }
}

export default AngleRightIcon;
