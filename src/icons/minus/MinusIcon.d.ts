import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class MinusIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        MinusIcon: DefineComponent<MinusIcon>;
    }
}

export default MinusIcon;
