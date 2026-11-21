export const style = /*css*/ `
    .rs-checkbox {
        position: relative;
        display: inline-flex;
        user-select: none;
        vertical-align: bottom;
        width: dt('checkbox.width');
        height: dt('checkbox.height');
    }

    .rs-checkbox-input {
        cursor: pointer;
        appearance: none;
        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: 1;
        outline: 0 none;
        border: 1px solid transparent;
        border-radius: dt('checkbox.border.radius');
    }

    .rs-checkbox-box {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: dt('checkbox.border.radius');
        border: 1px solid dt('checkbox.border.color');
        background: dt('checkbox.background');
        width: dt('checkbox.width');
        height: dt('checkbox.height');
        transition:
            background dt('checkbox.transition.duration'),
            color dt('checkbox.transition.duration'),
            border-color dt('checkbox.transition.duration'),
            box-shadow dt('checkbox.transition.duration'),
            outline-color dt('checkbox.transition.duration');
        outline-color: transparent;
        box-shadow: dt('checkbox.shadow');
    }

    .rs-checkbox-icon {
        transition-duration: dt('checkbox.transition.duration');
        color: dt('checkbox.icon.color');
        font-size: dt('checkbox.icon.size');
        width: dt('checkbox.icon.size');
        height: dt('checkbox.icon.size');
    }

    .rs-checkbox:not(.rs-disabled):has(.rs-checkbox-input:hover) .rs-checkbox-box {
        border-color: dt('checkbox.hover.border.color');
    }

    .rs-checkbox-checked .rs-checkbox-box {
        border-color: dt('checkbox.checked.border.color');
        background: dt('checkbox.checked.background');
    }

    .rs-checkbox-checked .rs-checkbox-icon {
        color: dt('checkbox.icon.checked.color');
    }

    .rs-checkbox-checked:not(.rs-disabled):has(.rs-checkbox-input:hover) .rs-checkbox-box {
        background: dt('checkbox.checked.hover.background');
        border-color: dt('checkbox.checked.hover.border.color');
    }

    .rs-checkbox-checked:not(.rs-disabled):has(.rs-checkbox-input:hover) .rs-checkbox-icon {
        color: dt('checkbox.icon.checked.hover.color');
    }

    .rs-checkbox:not(.rs-disabled):has(.rs-checkbox-input:focus-visible) .rs-checkbox-box {
        border-color: dt('checkbox.focus.border.color');
        box-shadow: dt('checkbox.focus.ring.shadow');
        outline: dt('checkbox.focus.ring.width') dt('checkbox.focus.ring.style') dt('checkbox.focus.ring.color');
        outline-offset: dt('checkbox.focus.ring.offset');
    }

    .rs-checkbox-checked:not(.rs-disabled):has(.rs-checkbox-input:focus-visible) .rs-checkbox-box {
        border-color: dt('checkbox.checked.focus.border.color');
    }

    .rs-checkbox.rs-invalid > .rs-checkbox-box {
        border-color: dt('checkbox.invalid.border.color');
    }

    .rs-checkbox.rs-variant-filled .rs-checkbox-box {
        background: dt('checkbox.filled.background');
    }

    .rs-checkbox-checked.rs-variant-filled .rs-checkbox-box {
        background: dt('checkbox.checked.background');
    }

    .rs-checkbox-checked.rs-variant-filled:not(.rs-disabled):has(.rs-checkbox-input:hover) .rs-checkbox-box {
        background: dt('checkbox.checked.hover.background');
    }

    .rs-checkbox.rs-disabled {
        opacity: 1;
    }

    .rs-checkbox.rs-disabled .rs-checkbox-box {
        background: dt('checkbox.disabled.background');
        border-color: dt('checkbox.checked.disabled.border.color');
    }

    .rs-checkbox.rs-disabled .rs-checkbox-box .rs-checkbox-icon {
        color: dt('checkbox.icon.disabled.color');
    }

    .rs-checkbox-sm,
    .rs-checkbox-sm .rs-checkbox-box {
        width: dt('checkbox.sm.width');
        height: dt('checkbox.sm.height');
    }

    .rs-checkbox-sm .rs-checkbox-icon {
        font-size: dt('checkbox.icon.sm.size');
        width: dt('checkbox.icon.sm.size');
        height: dt('checkbox.icon.sm.size');
    }

    .rs-checkbox-lg,
    .rs-checkbox-lg .rs-checkbox-box {
        width: dt('checkbox.lg.width');
        height: dt('checkbox.lg.height');
    }

    .rs-checkbox-lg .rs-checkbox-icon {
        font-size: dt('checkbox.icon.lg.size');
        width: dt('checkbox.icon.lg.size');
        height: dt('checkbox.icon.lg.size');
    }
`;
