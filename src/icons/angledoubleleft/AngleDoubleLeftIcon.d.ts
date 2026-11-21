import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class AngleDoubleLeftIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        AngleDoubleLeftIcon: DefineComponent<AngleDoubleLeftIcon>;
    }
}

export default AngleDoubleLeftIcon;
