import type { DefineComponent } from 'rose-spectacles/core';
import type { Icon } from 'rose-spectacles/icons/baseicon';

declare class WindowMaximizeIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        WindowMaximizeIcon: DefineComponent<WindowMaximizeIcon>;
    }
}

export default WindowMaximizeIcon;
