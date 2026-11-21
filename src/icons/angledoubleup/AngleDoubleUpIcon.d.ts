import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class AngleDoubleUpIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        AngleDoubleUpIcon: DefineComponent<AngleDoubleUpIcon>;
    }
}

export default AngleDoubleUpIcon;
