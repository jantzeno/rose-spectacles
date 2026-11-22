import type { DefineComponent, EmitFn } from 'rose-spectacles/core';
import type { AppSidebarProps, AppSidebarSlots, AppSidebarEmits } from './types';

export type * from './types';

type AppSidebarEventHandlers = { [K in keyof AppSidebarEmits]: (...args: AppSidebarEmits[K]) => void };

declare const AppSidebar: DefineComponent<AppSidebarProps, AppSidebarSlots, EmitFn<AppSidebarEventHandlers>>;

declare module 'vue' {
    export interface GlobalComponents {
        AppSidebar: typeof AppSidebar;
    }
}

export default AppSidebar;
