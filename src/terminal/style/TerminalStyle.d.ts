/**
 *
 * Terminal is a text based user interface.
 *
 *
 * @module terminalstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum TerminalClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-terminal',
    /**
     * Class name of the welcome message element
     */
    welcomeMessage = 'rs-terminal-welcome-message',
    /**
     * Class name of the command list element
     */
    commandList = 'rs-terminal-command-list',
    /**
     * Class name of the command element
     */
    command = 'rs-terminal-command',
    /**
     * Class name of the command value element
     */
    commandValue = 'rs-terminal-command-value',
    /**
     * Class name of the command response element
     */
    commandResponse = 'rs-terminal-command-response',
    /**
     * Class name of the prompt element
     */
    prompt = 'rs-terminal-prompt',
    /**
     * Class name of the prompt label element
     */
    promptLabel = 'rs-terminal-prompt-label',
    /**
     * Class name of the prompt value element
     */
    promptValue = 'rs-terminal-prompt-value'
}

export interface TerminalStyle extends BaseStyle {}

declare const style: TerminalStyle;
export default style;
