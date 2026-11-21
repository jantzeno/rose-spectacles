export const style = /*css*/ `
    .rs-multiselect {
        display: inline-flex;
        cursor: pointer;
        position: relative;
        user-select: none;
        background: dt('multiselect.background');
        border: 1px solid dt('multiselect.border.color');
        transition:
            background dt('multiselect.transition.duration'),
            color dt('multiselect.transition.duration'),
            border-color dt('multiselect.transition.duration'),
            outline-color dt('multiselect.transition.duration'),
            box-shadow dt('multiselect.transition.duration');
        border-radius: dt('multiselect.border.radius');
        outline-color: transparent;
        box-shadow: dt('multiselect.shadow');
    }

    .rs-multiselect:not(.rs-disabled):hover {
        border-color: dt('multiselect.hover.border.color');
    }

    .rs-multiselect:not(.rs-disabled).rs-focus {
        border-color: dt('multiselect.focus.border.color');
        box-shadow: dt('multiselect.focus.ring.shadow');
        outline: dt('multiselect.focus.ring.width') dt('multiselect.focus.ring.style') dt('multiselect.focus.ring.color');
        outline-offset: dt('multiselect.focus.ring.offset');
    }

    .rs-multiselect.rs-variant-filled {
        background: dt('multiselect.filled.background');
    }

    .rs-multiselect.rs-variant-filled:not(.rs-disabled):hover {
        background: dt('multiselect.filled.hover.background');
    }

    .rs-multiselect.rs-variant-filled.rs-focus {
        background: dt('multiselect.filled.focus.background');
    }

    .rs-multiselect.rs-invalid {
        border-color: dt('multiselect.invalid.border.color');
    }

    .rs-multiselect.rs-disabled {
        opacity: 1;
        background: dt('multiselect.disabled.background');
    }

    .rs-multiselect-dropdown {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        background: transparent;
        color: dt('multiselect.dropdown.color');
        width: dt('multiselect.dropdown.width');
        border-start-end-radius: dt('multiselect.border.radius');
        border-end-end-radius: dt('multiselect.border.radius');
    }

    .rs-multiselect-clear-icon {
        align-self: center;
        color: dt('multiselect.clear.icon.color');
        inset-inline-end: dt('multiselect.dropdown.width');
    }

    .rs-multiselect-label-container {
        overflow: hidden;
        flex: 1 1 auto;
        cursor: pointer;
    }

    .rs-multiselect-label {
        white-space: nowrap;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: dt('multiselect.padding.y') dt('multiselect.padding.x');
        color: dt('multiselect.color');
    }

    .rs-multiselect-display-chip .rs-multiselect-label {
        display: flex;
        align-items: center;
        gap: calc(dt('multiselect.padding.y') / 2);
    }

    .rs-multiselect-label.rs-placeholder {
        color: dt('multiselect.placeholder.color');
    }

    .rs-multiselect.rs-invalid .rs-multiselect-label.rs-placeholder {
        color: dt('multiselect.invalid.placeholder.color');
    }

    .rs-multiselect.rs-disabled .rs-multiselect-label {
        color: dt('multiselect.disabled.color');
    }

    .rs-multiselect-label-empty {
        overflow: hidden;
        visibility: hidden;
    }

    .rs-multiselect-overlay {
        position: absolute;
        top: 0;
        left: 0;
        background: dt('multiselect.overlay.background');
        color: dt('multiselect.overlay.color');
        border: 1px solid dt('multiselect.overlay.border.color');
        border-radius: dt('multiselect.overlay.border.radius');
        box-shadow: dt('multiselect.overlay.shadow');
        min-width: 100%;
    }

    .rs-multiselect-header {
        display: flex;
        align-items: center;
        padding: dt('multiselect.list.header.padding');
    }

    .rs-multiselect-header .rs-checkbox {
        margin-inline-end: dt('multiselect.option.gap');
    }

    .rs-multiselect-filter-container {
        flex: 1 1 auto;
    }

    .rs-multiselect-filter {
        width: 100%;
    }

    .rs-multiselect-list-container {
        overflow: auto;
    }

    .rs-multiselect-list {
        margin: 0;
        padding: 0;
        list-style-type: none;
        padding: dt('multiselect.list.padding');
        display: flex;
        flex-direction: column;
        gap: dt('multiselect.list.gap');
    }

    .rs-multiselect-option {
        cursor: pointer;
        font-weight: normal;
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        gap: dt('multiselect.option.gap');
        padding: dt('multiselect.option.padding');
        border: 0 none;
        color: dt('multiselect.option.color');
        background: transparent;
        transition:
            background dt('multiselect.transition.duration'),
            color dt('multiselect.transition.duration'),
            border-color dt('multiselect.transition.duration'),
            box-shadow dt('multiselect.transition.duration'),
            outline-color dt('multiselect.transition.duration');
        border-radius: dt('multiselect.option.border.radius');
    }

    .rs-multiselect-option:not(.rs-multiselect-option-selected):not(.rs-disabled).rs-focus {
        background: dt('multiselect.option.focus.background');
        color: dt('multiselect.option.focus.color');
    }

    .rs-multiselect-option:not(.rs-multiselect-option-selected):not(.rs-disabled):hover {
        background: dt('multiselect.option.focus.background');
        color: dt('multiselect.option.focus.color');
    }

    .rs-multiselect-option.rs-multiselect-option-selected {
        background: dt('multiselect.option.selected.background');
        color: dt('multiselect.option.selected.color');
    }

    .rs-multiselect-option.rs-multiselect-option-selected.rs-focus {
        background: dt('multiselect.option.selected.focus.background');
        color: dt('multiselect.option.selected.focus.color');
    }

    .rs-multiselect-option-group {
        cursor: auto;
        margin: 0;
        padding: dt('multiselect.option.group.padding');
        background: dt('multiselect.option.group.background');
        color: dt('multiselect.option.group.color');
        font-weight: dt('multiselect.option.group.font.weight');
    }

    .rs-multiselect-empty-message {
        padding: dt('multiselect.empty.message.padding');
    }

    .rs-multiselect-label .rs-chip {
        padding-block-start: calc(dt('multiselect.padding.y') / 2);
        padding-block-end: calc(dt('multiselect.padding.y') / 2);
        border-radius: dt('multiselect.chip.border.radius');
    }

    .rs-multiselect-label:has(.rs-chip) {
        padding: calc(dt('multiselect.padding.y') / 2) calc(dt('multiselect.padding.x') / 2);
    }

    .rs-multiselect-fluid {
        display: flex;
        width: 100%;
    }

    .rs-multiselect-sm .rs-multiselect-label {
        font-size: dt('multiselect.sm.font.size');
        padding-block: dt('multiselect.sm.padding.y');
        padding-inline: dt('multiselect.sm.padding.x');
    }

    .rs-multiselect-sm .rs-multiselect-dropdown .rs-icon {
        font-size: dt('multiselect.sm.font.size');
        width: dt('multiselect.sm.font.size');
        height: dt('multiselect.sm.font.size');
    }

    .rs-multiselect-lg .rs-multiselect-label {
        font-size: dt('multiselect.lg.font.size');
        padding-block: dt('multiselect.lg.padding.y');
        padding-inline: dt('multiselect.lg.padding.x');
    }

    .rs-multiselect-lg .rs-multiselect-dropdown .rs-icon {
        font-size: dt('multiselect.lg.font.size');
        width: dt('multiselect.lg.font.size');
        height: dt('multiselect.lg.font.size');
    }

    .rs-floatlabel-in .rs-multiselect-filter {
        padding-block-start: dt('multiselect.padding.y');
        padding-block-end: dt('multiselect.padding.y');
    }
`;
