export const style = /*css*/ `
    .rs-terminal {
        display: block;
        height: dt('terminal.height');
        overflow: auto;
        background: dt('terminal.background');
        color: dt('terminal.color');
        border: 1px solid dt('terminal.border.color');
        padding: dt('terminal.padding');
        border-radius: dt('terminal.border.radius');
    }

    .rs-terminal-prompt {
        display: flex;
        align-items: center;
    }

    .rs-terminal-prompt-value {
        flex: 1 1 auto;
        border: 0 none;
        background: transparent;
        color: inherit;
        padding: 0;
        outline: 0 none;
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
    }

    .rs-terminal-prompt-label {
        margin-inline-end: dt('terminal.prompt.gap');
    }

    .rs-terminal-input::-ms-clear {
        display: none;
    }

    .rs-terminal-command-response {
        margin: dt('terminal.command.response.margin');
    }
`;
