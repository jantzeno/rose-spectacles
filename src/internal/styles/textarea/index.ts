export const style = /*css*/ `
    .rs-textarea {
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: dt('textarea.color');
        background: dt('textarea.background');
        padding-block: dt('textarea.padding.y');
        padding-inline: dt('textarea.padding.x');
        border: 1px solid dt('textarea.border.color');
        transition:
            background dt('textarea.transition.duration'),
            color dt('textarea.transition.duration'),
            border-color dt('textarea.transition.duration'),
            outline-color dt('textarea.transition.duration'),
            box-shadow dt('textarea.transition.duration');
        appearance: none;
        border-radius: dt('textarea.border.radius');
        outline-color: transparent;
        box-shadow: dt('textarea.shadow');
    }

    .rs-textarea:enabled:hover {
        border-color: dt('textarea.hover.border.color');
    }

    .rs-textarea:enabled:focus {
        border-color: dt('textarea.focus.border.color');
        box-shadow: dt('textarea.focus.ring.shadow');
        outline: dt('textarea.focus.ring.width') dt('textarea.focus.ring.style') dt('textarea.focus.ring.color');
        outline-offset: dt('textarea.focus.ring.offset');
    }

    .rs-textarea.rs-invalid {
        border-color: dt('textarea.invalid.border.color');
    }

    .rs-textarea.rs-variant-filled {
        background: dt('textarea.filled.background');
    }

    .rs-textarea.rs-variant-filled:enabled:hover {
        background: dt('textarea.filled.hover.background');
    }

    .rs-textarea.rs-variant-filled:enabled:focus {
        background: dt('textarea.filled.focus.background');
    }

    .rs-textarea:disabled {
        opacity: 1;
        background: dt('textarea.disabled.background');
        color: dt('textarea.disabled.color');
    }

    .rs-textarea::placeholder {
        color: dt('textarea.placeholder.color');
    }

    .rs-textarea.rs-invalid::placeholder {
        color: dt('textarea.invalid.placeholder.color');
    }

    .rs-textarea-fluid {
        width: 100%;
    }

    .rs-textarea-resizable {
        overflow: hidden;
        resize: none;
    }

    .rs-textarea-sm {
        font-size: dt('textarea.sm.font.size');
        padding-block: dt('textarea.sm.padding.y');
        padding-inline: dt('textarea.sm.padding.x');
    }

    .rs-textarea-lg {
        font-size: dt('textarea.lg.font.size');
        padding-block: dt('textarea.lg.padding.y');
        padding-inline: dt('textarea.lg.padding.x');
    }
`;
