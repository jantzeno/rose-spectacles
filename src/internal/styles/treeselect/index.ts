export const style = /*css*/ `
    .rs-treeselect {
        display: inline-flex;
        cursor: pointer;
        position: relative;
        user-select: none;
        background: dt('treeselect.background');
        border: 1px solid dt('treeselect.border.color');
        transition:
            background dt('treeselect.transition.duration'),
            color dt('treeselect.transition.duration'),
            border-color dt('treeselect.transition.duration'),
            outline-color dt('treeselect.transition.duration'),
            box-shadow dt('treeselect.transition.duration');
        border-radius: dt('treeselect.border.radius');
        outline-color: transparent;
        box-shadow: dt('treeselect.shadow');
    }

    .rs-treeselect:not(.rs-disabled):hover {
        border-color: dt('treeselect.hover.border.color');
    }

    .rs-treeselect:not(.rs-disabled).rs-focus {
        border-color: dt('treeselect.focus.border.color');
        box-shadow: dt('treeselect.focus.ring.shadow');
        outline: dt('treeselect.focus.ring.width') dt('treeselect.focus.ring.style') dt('treeselect.focus.ring.color');
        outline-offset: dt('treeselect.focus.ring.offset');
    }

    .rs-treeselect.rs-variant-filled {
        background: dt('treeselect.filled.background');
    }

    .rs-treeselect.rs-variant-filled:not(.rs-disabled):hover {
        background: dt('treeselect.filled.hover.background');
    }

    .rs-treeselect.rs-variant-filled.rs-focus {
        background: dt('treeselect.filled.focus.background');
    }

    .rs-treeselect.rs-invalid {
        border-color: dt('treeselect.invalid.border.color');
    }

    .rs-treeselect.rs-disabled {
        opacity: 1;
        background: dt('treeselect.disabled.background');
    }

    .rs-treeselect-clear-icon {
        align-self: center;
        color: dt('treeselect.clear.icon.color');
        inset-inline-end: dt('treeselect.dropdown.width');
    }

    .rs-treeselect-dropdown {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        background: transparent;
        color: dt('treeselect.dropdown.color');
        width: dt('treeselect.dropdown.width');
        border-start-end-radius: dt('border.radius.md');
        border-end-end-radius: dt('border.radius.md');
    }

    .rs-treeselect-label-container {
        overflow: hidden;
        flex: 1 1 auto;
        cursor: pointer;
    }

    .rs-treeselect-label {
        display: flex;
        align-items: center;
        gap: calc(dt('treeselect.padding.y') / 2);
        white-space: nowrap;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: dt('treeselect.padding.y') dt('treeselect.padding.x');
        color: dt('treeselect.color');
    }

    .rs-treeselect-label.rs-placeholder {
        color: dt('treeselect.placeholder.color');
    }

    .rs-treeselect.rs-invalid .rs-treeselect-label.rs-placeholder {
        color: dt('treeselect.invalid.placeholder.color');
    }

    .rs-treeselect:has(.rs-select-clear-icon) .rs-treeselect-label {
        padding-inline-end: dt('treeselect.padding.x');
    }

    .rs-treeselect.rs-disabled .rs-treeselect-label {
        color: dt('treeselect.disabled.color');
    }

    .rs-treeselect-label-empty {
        overflow: hidden;
        visibility: hidden;
    }

    .rs-treeselect-overlay {
        position: absolute;
        top: 0;
        left: 0;
        background: dt('treeselect.overlay.background');
        color: dt('treeselect.overlay.color');
        border: 1px solid dt('treeselect.overlay.border.color');
        border-radius: dt('treeselect.overlay.border.radius');
        box-shadow: dt('treeselect.overlay.shadow');
        overflow: hidden;
        min-width: 100%;
        will-change: transform;
    }

    .rs-treeselect-tree-container {
        overflow: auto;
    }

    .rs-treeselect-empty-message {
        padding: dt('treeselect.empty.message.padding');
        background: transparent;
    }

    .rs-treeselect-fluid {
        display: flex;
    }

    .rs-treeselect-overlay .rs-tree {
        padding: dt('treeselect.tree.padding');
    }

    .rs-treeselect-overlay .rs-tree-loading {
        min-height: 3rem;
    }

    .rs-treeselect-label .rs-chip {
        padding-block-start: calc(dt('treeselect.padding.y') / 2);
        padding-block-end: calc(dt('treeselect.padding.y') / 2);
        border-radius: dt('treeselect.chip.border.radius');
    }

    .rs-treeselect-label:has(.rs-chip) {
        padding: calc(dt('treeselect.padding.y') / 2) calc(dt('treeselect.padding.x') / 2);
    }

    .rs-treeselect-sm .rs-treeselect-label {
        font-size: dt('treeselect.sm.font.size');
        padding-block: dt('treeselect.sm.padding.y');
        padding-inline: dt('treeselect.sm.padding.x');
    }

    .rs-treeselect-sm .rs-treeselect-dropdown .rs-icon {
        font-size: dt('treeselect.sm.font.size');
        width: dt('treeselect.sm.font.size');
        height: dt('treeselect.sm.font.size');
    }

    .rs-treeselect-lg .rs-treeselect-label {
        font-size: dt('treeselect.lg.font.size');
        padding-block: dt('treeselect.lg.padding.y');
        padding-inline: dt('treeselect.lg.padding.x');
    }

    .rs-treeselect-lg .rs-treeselect-dropdown .rs-icon {
        font-size: dt('treeselect.lg.font.size');
        width: dt('treeselect.lg.font.size');
        height: dt('treeselect.lg.font.size');
    }
`;
