import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class AngleUpIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        AngleUpIcon: DefineComponent<AngleUpIcon>;
    }
}

export default AngleUpIcon;
