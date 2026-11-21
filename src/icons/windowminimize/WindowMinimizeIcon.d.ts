import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class WindowMinimizeIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        WindowMinimizeIcon: DefineComponent<WindowMinimizeIcon>;
    }
}

export default WindowMinimizeIcon;
