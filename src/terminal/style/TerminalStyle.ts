import { style } from '../../internal/styles/terminal/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: 'rs-terminal rs-component',
    welcomeMessage: 'rs-terminal-welcome-message',
    commandList: 'rs-terminal-command-list',
    command: 'rs-terminal-command',
    commandValue: 'rs-terminal-command-value',
    commandResponse: 'rs-terminal-command-response',
    prompt: 'rs-terminal-prompt',
    promptLabel: 'rs-terminal-prompt-label',
    promptValue: 'rs-terminal-prompt-value'
};

export default BaseStyle.extend({
    name: 'terminal',
    style,
    classes
});
