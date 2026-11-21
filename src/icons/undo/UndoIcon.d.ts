import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class UndoIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        UndoIcon: DefineComponent<UndoIcon>;
    }
}

export default UndoIcon;
