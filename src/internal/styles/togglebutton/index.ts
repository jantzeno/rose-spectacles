export const style = /*css*/ `
    .rs-togglebutton {
        display: inline-flex;
        cursor: pointer;
        user-select: none;
        overflow: hidden;
        position: relative;
        color: dt('togglebutton.color');
        background: dt('togglebutton.background');
        border: 1px solid dt('togglebutton.border.color');
        padding: dt('togglebutton.padding');
        font-size: 1rem;
        font-family: inherit;
        font-feature-settings: inherit;
        transition:
            background dt('togglebutton.transition.duration'),
            color dt('togglebutton.transition.duration'),
            border-color dt('togglebutton.transition.duration'),
            outline-color dt('togglebutton.transition.duration'),
            box-shadow dt('togglebutton.transition.duration');
        border-radius: dt('togglebutton.border.radius');
        outline-color: transparent;
        font-weight: dt('togglebutton.font.weight');
    }

    .rs-togglebutton-content {
        display: inline-flex;
        flex: 1 1 auto;
        align-items: center;
        justify-content: center;
        gap: dt('togglebutton.gap');
        padding: dt('togglebutton.content.padding');
        background: transparent;
        border-radius: dt('togglebutton.content.border.radius');
        transition:
            background dt('togglebutton.transition.duration'),
            color dt('togglebutton.transition.duration'),
            border-color dt('togglebutton.transition.duration'),
            outline-color dt('togglebutton.transition.duration'),
            box-shadow dt('togglebutton.transition.duration');
    }

    .rs-togglebutton:not(:disabled):not(.rs-togglebutton-checked):hover {
        background: dt('togglebutton.hover.background');
        color: dt('togglebutton.hover.color');
    }

    .rs-togglebutton.rs-togglebutton-checked {
        background: dt('togglebutton.checked.background');
        border-color: dt('togglebutton.checked.border.color');
        color: dt('togglebutton.checked.color');
    }

    .rs-togglebutton-checked .rs-togglebutton-content {
        background: dt('togglebutton.content.checked.background');
        box-shadow: dt('togglebutton.content.checked.shadow');
    }

    .rs-togglebutton:focus-visible {
        box-shadow: dt('togglebutton.focus.ring.shadow');
        outline: dt('togglebutton.focus.ring.width') dt('togglebutton.focus.ring.style') dt('togglebutton.focus.ring.color');
        outline-offset: dt('togglebutton.focus.ring.offset');
    }

    .rs-togglebutton.rs-invalid {
        border-color: dt('togglebutton.invalid.border.color');
    }

    .rs-togglebutton:disabled {
        opacity: 1;
        cursor: default;
        background: dt('togglebutton.disabled.background');
        border-color: dt('togglebutton.disabled.border.color');
        color: dt('togglebutton.disabled.color');
    }

    .rs-togglebutton-label,
    .rs-togglebutton-icon {
        position: relative;
        transition: none;
    }

    .rs-togglebutton-icon {
        color: dt('togglebutton.icon.color');
    }

    .rs-togglebutton:not(:disabled):not(.rs-togglebutton-checked):hover .rs-togglebutton-icon {
        color: dt('togglebutton.icon.hover.color');
    }

    .rs-togglebutton.rs-togglebutton-checked .rs-togglebutton-icon {
        color: dt('togglebutton.icon.checked.color');
    }

    .rs-togglebutton:disabled .rs-togglebutton-icon {
        color: dt('togglebutton.icon.disabled.color');
    }

    .rs-togglebutton-sm {
        padding: dt('togglebutton.sm.padding');
        font-size: dt('togglebutton.sm.font.size');
    }

    .rs-togglebutton-sm .rs-togglebutton-content {
        padding: dt('togglebutton.content.sm.padding');
    }

    .rs-togglebutton-lg {
        padding: dt('togglebutton.lg.padding');
        font-size: dt('togglebutton.lg.font.size');
    }

    .rs-togglebutton-lg .rs-togglebutton-content {
        padding: dt('togglebutton.content.lg.padding');
    }

    .rs-togglebutton-fluid {
        width: 100%;
    }
`;
