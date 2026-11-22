import type { DefineComponent, EmitFn } from 'rose-spectacles/core';
import type { CommandPaletteProps, CommandPaletteSlots, CommandPaletteEmits } from './types';

export type * from './types';

type CommandPaletteEventHandlers = { [K in keyof CommandPaletteEmits]: (...args: CommandPaletteEmits[K]) => void };

declare const CommandPalette: DefineComponent<CommandPaletteProps, CommandPaletteSlots, EmitFn<CommandPaletteEventHandlers>>;

declare module 'vue' {
    export interface GlobalComponents {
        CommandPalette: typeof CommandPalette;
    }
}

export default CommandPalette;
