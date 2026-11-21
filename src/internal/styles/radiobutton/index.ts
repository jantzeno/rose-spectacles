export const style = /*css*/ `
    .rs-radiobutton {
        position: relative;
        display: inline-flex;
        user-select: none;
        vertical-align: bottom;
        width: dt('radiobutton.width');
        height: dt('radiobutton.height');
    }

    .rs-radiobutton-input {
        cursor: pointer;
        appearance: none;
        position: absolute;
        top: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: 1;
        outline: 0 none;
        border: 1px solid transparent;
        border-radius: 50%;
    }

    .rs-radiobutton-box {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        border: 1px solid dt('radiobutton.border.color');
        background: dt('radiobutton.background');
        width: dt('radiobutton.width');
        height: dt('radiobutton.height');
        transition:
            background dt('radiobutton.transition.duration'),
            color dt('radiobutton.transition.duration'),
            border-color dt('radiobutton.transition.duration'),
            box-shadow dt('radiobutton.transition.duration'),
            outline-color dt('radiobutton.transition.duration');
        outline-color: transparent;
        box-shadow: dt('radiobutton.shadow');
    }

    .rs-radiobutton-icon {
        transition-duration: dt('radiobutton.transition.duration');
        background: transparent;
        font-size: dt('radiobutton.icon.size');
        width: dt('radiobutton.icon.size');
        height: dt('radiobutton.icon.size');
        border-radius: 50%;
        backface-visibility: hidden;
        transform: translateZ(0) scale(0.1);
    }

    .rs-radiobutton:not(.rs-disabled):has(.rs-radiobutton-input:hover) .rs-radiobutton-box {
        border-color: dt('radiobutton.hover.border.color');
    }

    .rs-radiobutton-checked .rs-radiobutton-box {
        border-color: dt('radiobutton.checked.border.color');
        background: dt('radiobutton.checked.background');
    }

    .rs-radiobutton-checked .rs-radiobutton-box .rs-radiobutton-icon {
        background: dt('radiobutton.icon.checked.color');
        transform: translateZ(0) scale(1, 1);
        visibility: visible;
    }

    .rs-radiobutton-checked:not(.rs-disabled):has(.rs-radiobutton-input:hover) .rs-radiobutton-box {
        border-color: dt('radiobutton.checked.hover.border.color');
        background: dt('radiobutton.checked.hover.background');
    }

    .rs-radiobutton:not(.rs-disabled):has(.rs-radiobutton-input:hover).rs-radiobutton-checked .rs-radiobutton-box .rs-radiobutton-icon {
        background: dt('radiobutton.icon.checked.hover.color');
    }

    .rs-radiobutton:not(.rs-disabled):has(.rs-radiobutton-input:focus-visible) .rs-radiobutton-box {
        border-color: dt('radiobutton.focus.border.color');
        box-shadow: dt('radiobutton.focus.ring.shadow');
        outline: dt('radiobutton.focus.ring.width') dt('radiobutton.focus.ring.style') dt('radiobutton.focus.ring.color');
        outline-offset: dt('radiobutton.focus.ring.offset');
    }

    .rs-radiobutton-checked:not(.rs-disabled):has(.rs-radiobutton-input:focus-visible) .rs-radiobutton-box {
        border-color: dt('radiobutton.checked.focus.border.color');
    }

    .rs-radiobutton.rs-invalid > .rs-radiobutton-box {
        border-color: dt('radiobutton.invalid.border.color');
    }

    .rs-radiobutton.rs-variant-filled .rs-radiobutton-box {
        background: dt('radiobutton.filled.background');
    }

    .rs-radiobutton.rs-variant-filled.rs-radiobutton-checked .rs-radiobutton-box {
        background: dt('radiobutton.checked.background');
    }

    .rs-radiobutton.rs-variant-filled:not(.rs-disabled):has(.rs-radiobutton-input:hover).rs-radiobutton-checked .rs-radiobutton-box {
        background: dt('radiobutton.checked.hover.background');
    }

    .rs-radiobutton.rs-disabled {
        opacity: 1;
    }

    .rs-radiobutton.rs-disabled .rs-radiobutton-box {
        background: dt('radiobutton.disabled.background');
        border-color: dt('radiobutton.checked.disabled.border.color');
    }

    .rs-radiobutton-checked.rs-disabled .rs-radiobutton-box .rs-radiobutton-icon {
        background: dt('radiobutton.icon.disabled.color');
    }

    .rs-radiobutton-sm,
    .rs-radiobutton-sm .rs-radiobutton-box {
        width: dt('radiobutton.sm.width');
        height: dt('radiobutton.sm.height');
    }

    .rs-radiobutton-sm .rs-radiobutton-icon {
        font-size: dt('radiobutton.icon.sm.size');
        width: dt('radiobutton.icon.sm.size');
        height: dt('radiobutton.icon.sm.size');
    }

    .rs-radiobutton-lg,
    .rs-radiobutton-lg .rs-radiobutton-box {
        width: dt('radiobutton.lg.width');
        height: dt('radiobutton.lg.height');
    }

    .rs-radiobutton-lg .rs-radiobutton-icon {
        font-size: dt('radiobutton.icon.lg.size');
        width: dt('radiobutton.icon.lg.size');
        height: dt('radiobutton.icon.lg.size');
    }
`;
