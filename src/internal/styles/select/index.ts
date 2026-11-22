export const style = /*css*/ `
    .rs-select {
        display: inline-flex;
        cursor: pointer;
        position: relative;
        user-select: none;
        background: dt('select.background');
        border: 1px solid dt('select.border.color');
        transition:
            background dt('select.transition.duration'),
            color dt('select.transition.duration'),
            border-color dt('select.transition.duration'),
            outline-color dt('select.transition.duration'),
            box-shadow dt('select.transition.duration');
        border-radius: dt('select.border.radius');
        outline-color: transparent;
        box-shadow: dt('select.shadow');
    }

    .rs-select:not(.rs-disabled):hover {
        border-color: dt('select.hover.border.color');
    }

    .rs-select:not(.rs-disabled).rs-focus {
        border-color: dt('select.focus.border.color');
        box-shadow: dt('select.focus.ring.shadow');
        outline: dt('select.focus.ring.width') dt('select.focus.ring.style') dt('select.focus.ring.color');
        outline-offset: dt('select.focus.ring.offset');
    }

    .rs-select.rs-variant-filled {
        background: dt('select.filled.background');
    }

    .rs-select.rs-variant-filled:not(.rs-disabled):hover {
        background: dt('select.filled.hover.background');
    }

    .rs-select.rs-variant-filled:not(.rs-disabled).rs-focus {
        background: dt('select.filled.focus.background');
    }

    .rs-select.rs-invalid {
        border-color: dt('select.invalid.border.color');
    }

    .rs-select.rs-disabled {
        opacity: 1;
        background: dt('select.disabled.background');
    }

    .rs-select-clear-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        align-self: center;
        flex-shrink: 0;
        background: transparent;
        border: 0;
        padding: 0;
        cursor: pointer;
    }

    .rs-select-clear-icon {
        align-self: center;
        color: dt('select.clear.icon.color');
        inset-inline-end: dt('select.dropdown.width');
    }

    .rs-select-dropdown {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        background: transparent;
        color: dt('select.dropdown.color');
        width: dt('select.dropdown.width');
        border-start-end-radius: dt('select.border.radius');
        border-end-end-radius: dt('select.border.radius');
    }

    .rs-select-label {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        flex: 1 1 auto;
        width: 1%;
        padding: dt('select.padding.y') dt('select.padding.x');
        text-overflow: ellipsis;
        cursor: pointer;
        color: dt('select.color');
        background: transparent;
        border: 0 none;
        outline: 0 none;
        font-size: 1rem;
    }

    .rs-select-label.rs-placeholder {
        color: dt('select.placeholder.color');
    }

    .rs-select.rs-invalid .rs-select-label.rs-placeholder {
        color: dt('select.invalid.placeholder.color');
    }

    .rs-select.rs-disabled .rs-select-label {
        color: dt('select.disabled.color');
    }

    .rs-select-label-empty {
        overflow: hidden;
        opacity: 0;
    }

    input.rs-select-label {
        cursor: default;
    }

    .rs-select-overlay {
        position: absolute;
        top: 0;
        left: 0;
        background: dt('select.overlay.background');
        color: dt('select.overlay.color');
        border: 1px solid dt('select.overlay.border.color');
        border-radius: dt('select.overlay.border.radius');
        box-shadow: dt('select.overlay.shadow');
        min-width: 100%;
        transform-origin: inherit;
        will-change: transform;
    }

    .rs-select-header {
        padding: dt('select.list.header.padding');
    }

    .rs-select-filter {
        width: 100%;
    }

    .rs-select-list-container {
        overflow: auto;
    }

    .rs-select-option-group {
        cursor: auto;
        margin: 0;
        padding: dt('select.option.group.padding');
        background: dt('select.option.group.background');
        color: dt('select.option.group.color');
        font-weight: dt('select.option.group.font.weight');
    }

    .rs-select-list {
        margin: 0;
        padding: 0;
        list-style-type: none;
        padding: dt('select.list.padding');
        gap: dt('select.list.gap');
        display: flex;
        flex-direction: column;
    }

    .rs-select-option {
        cursor: pointer;
        font-weight: normal;
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        padding: dt('select.option.padding');
        border: 0 none;
        color: dt('select.option.color');
        background: transparent;
        transition:
            background dt('select.transition.duration'),
            color dt('select.transition.duration'),
            border-color dt('select.transition.duration'),
            box-shadow dt('select.transition.duration'),
            outline-color dt('select.transition.duration');
        border-radius: dt('select.option.border.radius');
    }

    .rs-select-option:not(.rs-select-option-selected):not(.rs-disabled).rs-focus {
        background: dt('select.option.focus.background');
        color: dt('select.option.focus.color');
    }

    .rs-select-option:not(.rs-select-option-selected):not(.rs-disabled):hover {
        background: dt('select.option.focus.background');
        color: dt('select.option.focus.color');
    }

    .rs-select-option.rs-select-option-selected {
        background: dt('select.option.selected.background');
        color: dt('select.option.selected.color');
    }

    .rs-select-option.rs-select-option-selected.rs-focus {
        background: dt('select.option.selected.focus.background');
        color: dt('select.option.selected.focus.color');
    }

    .rs-select-option-blank-icon {
        flex-shrink: 0;
        inline-size: var(--rs-icon-size, 14px);
    }

    .rs-select-option-check-icon {
        position: relative;
        flex-shrink: 0;
        margin-inline-start: dt('select.checkmark.gutter.start');
        margin-inline-end: dt('select.checkmark.gutter.end');
        color: dt('select.checkmark.color');
    }

    .rs-select-empty-message {
        padding: dt('select.empty.message.padding');
    }

    .rs-select-fluid {
        display: flex;
        width: 100%;
    }

    .rs-select-sm .rs-select-label {
        font-size: dt('select.sm.font.size');
        padding-block: dt('select.sm.padding.y');
        padding-inline: dt('select.sm.padding.x');
    }

    .rs-select-sm .rs-select-dropdown .rs-icon {
        font-size: dt('select.sm.font.size');
        width: dt('select.sm.font.size');
        height: dt('select.sm.font.size');
    }

    .rs-select-lg .rs-select-label {
        font-size: dt('select.lg.font.size');
        padding-block: dt('select.lg.padding.y');
        padding-inline: dt('select.lg.padding.x');
    }

    .rs-select-lg .rs-select-dropdown .rs-icon {
        font-size: dt('select.lg.font.size');
        width: dt('select.lg.font.size');
        height: dt('select.lg.font.size');
    }

    .rs-floatlabel-in .rs-select-filter {
        padding-block-start: dt('select.padding.y');
        padding-block-end: dt('select.padding.y');
    }
`;
