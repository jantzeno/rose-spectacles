export const style = /*css*/ `
    .rs-cascadeselect {
        display: inline-flex;
        cursor: pointer;
        position: relative;
        user-select: none;
        background: dt('cascadeselect.background');
        border: 1px solid dt('cascadeselect.border.color');
        transition:
            background dt('cascadeselect.transition.duration'),
            color dt('cascadeselect.transition.duration'),
            border-color dt('cascadeselect.transition.duration'),
            outline-color dt('cascadeselect.transition.duration'),
            box-shadow dt('cascadeselect.transition.duration');
        border-radius: dt('cascadeselect.border.radius');
        outline-color: transparent;
        box-shadow: dt('cascadeselect.shadow');
    }

    .rs-cascadeselect:not(.rs-disabled):hover {
        border-color: dt('cascadeselect.hover.border.color');
    }

    .rs-cascadeselect:not(.rs-disabled).rs-focus {
        border-color: dt('cascadeselect.focus.border.color');
        box-shadow: dt('cascadeselect.focus.ring.shadow');
        outline: dt('cascadeselect.focus.ring.width') dt('cascadeselect.focus.ring.style') dt('cascadeselect.focus.ring.color');
        outline-offset: dt('cascadeselect.focus.ring.offset');
    }

    .rs-cascadeselect.rs-variant-filled {
        background: dt('cascadeselect.filled.background');
    }

    .rs-cascadeselect.rs-variant-filled:not(.rs-disabled):hover {
        background: dt('cascadeselect.filled.hover.background');
    }

    .rs-cascadeselect.rs-variant-filled.rs-focus {
        background: dt('cascadeselect.filled.focus.background');
    }

    .rs-cascadeselect.rs-invalid {
        border-color: dt('cascadeselect.invalid.border.color');
    }

    .rs-cascadeselect.rs-disabled {
        opacity: 1;
        background: dt('cascadeselect.disabled.background');
    }

    .rs-cascadeselect-dropdown {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        background: transparent;
        color: dt('cascadeselect.dropdown.color');
        width: dt('cascadeselect.dropdown.width');
        border-start-end-radius: dt('border.radius.md');
        border-end-end-radius: dt('border.radius.md');
    }

    .rs-cascadeselect-clear-icon {
        align-self: center;
        color: dt('cascadeselect.clear.icon.color');
        inset-inline-end: dt('cascadeselect.dropdown.width');
    }

    .rs-cascadeselect-label {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        flex: 1 1 auto;
        width: 1%;
        text-overflow: ellipsis;
        cursor: pointer;
        padding: dt('cascadeselect.padding.y') dt('cascadeselect.padding.x');
        background: transparent;
        border: 0 none;
        outline: 0 none;
    }

    .rs-cascadeselect-label.rs-placeholder {
        color: dt('cascadeselect.placeholder.color');
    }

    .rs-cascadeselect.rs-invalid .rs-cascadeselect-label.rs-placeholder {
        color: dt('cascadeselect.invalid.placeholder.color');
    }

    .rs-cascadeselect.rs-disabled .rs-cascadeselect-label {
        color: dt('cascadeselect.disabled.color');
    }

    .rs-cascadeselect-label-empty {
        overflow: hidden;
        visibility: hidden;
    }

    .rs-cascadeselect-overlay {
        background: dt('cascadeselect.overlay.background');
        color: dt('cascadeselect.overlay.color');
        border: 1px solid dt('cascadeselect.overlay.border.color');
        border-radius: dt('cascadeselect.overlay.border.radius');
        box-shadow: dt('cascadeselect.overlay.shadow');
    }

    .rs-cascadeselect .rs-cascadeselect-overlay {
        min-width: 100%;
    }

    .rs-cascadeselect-option-list {
        display: none;
        min-width: 100%;
        position: absolute;
        z-index: 1;
    }

    .rs-cascadeselect-list {
        min-width: 100%;
        margin: 0;
        padding: 0;
        list-style-type: none;
        padding: dt('cascadeselect.list.padding');
        display: flex;
        flex-direction: column;
        gap: dt('cascadeselect.list.gap');
    }

    .rs-cascadeselect-option {
        cursor: pointer;
        font-weight: normal;
        white-space: nowrap;
        border: 0 none;
        color: dt('cascadeselect.option.color');
        background: transparent;
        border-radius: dt('cascadeselect.option.border.radius');
    }

    .rs-cascadeselect-option-active {
        overflow: visible;
    }

    .rs-cascadeselect-option-active > .rs-cascadeselect-option-content {
        background: dt('cascadeselect.option.focus.background');
        color: dt('cascadeselect.option.focus.color');
    }

    .rs-cascadeselect-option:not(.rs-cascadeselect-option-selected):not(.rs-disabled).rs-focus > .rs-cascadeselect-option-content {
        background: dt('cascadeselect.option.focus.background');
        color: dt('cascadeselect.option.focus.color');
    }

    .rs-cascadeselect-option:not(.rs-cascadeselect-option-selected):not(.rs-disabled):hover > .rs-cascadeselect-option-content {
        background: dt('cascadeselect.option.focus.background');
        color: dt('cascadeselect.option.focus.color');
    }

    .rs-cascadeselect-option:not(.rs-cascadeselect-option-selected):not(.rs-disabled).rs-focus > .rs-cascadeselect-option-content > .rs-cascadeselect-group-icon-container > .rs-cascadeselect-group-icon {
        color: dt('cascadeselect.option.icon.focus.color');
    }

    .rs-cascadeselect-option:not(.rs-cascadeselect-option-selected):not(.rs-disabled):hover > .rs-cascadeselect-option-content > .rs-cascadeselect-group-icon-container > .rs-cascadeselect-group-icon {
        color: dt('cascadeselect.option.icon.focus.color');
    }

    .rs-cascadeselect-option-selected > .rs-cascadeselect-option-content {
        background: dt('cascadeselect.option.selected.background');
        color: dt('cascadeselect.option.selected.color');
    }

    .rs-cascadeselect-option-selected.rs-focus > .rs-cascadeselect-option-content {
        background: dt('cascadeselect.option.selected.focus.background');
        color: dt('cascadeselect.option.selected.focus.color');
    }

    .rs-cascadeselect-option-active > .rs-cascadeselect-option-list {
        inset-inline-start: 100%;
        inset-block-start: 0;
    }

    .rs-cascadeselect-option-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;
        position: relative;
        padding: dt('cascadeselect.option.padding');
        border-radius: dt('cascadeselect.option.border.radius');
        transition:
            background dt('cascadeselect.transition.duration'),
            color dt('cascadeselect.transition.duration'),
            border-color dt('cascadeselect.transition.duration'),
            box-shadow dt('cascadeselect.transition.duration'),
            outline-color dt('cascadeselect.transition.duration');
    }

    .rs-cascadeselect-group-icon {
        font-size: dt('cascadeselect.option.icon.size');
        width: dt('cascadeselect.option.icon.size');
        height: dt('cascadeselect.option.icon.size');
        color: dt('cascadeselect.option.icon.color');
    }

    .rs-cascadeselect-group-icon:dir(rtl) {
        transform: rotate(180deg);
    }

    .rs-cascadeselect-mobile-active .rs-cascadeselect-option-list {
        position: static;
        box-shadow: none;
        border: 0 none;
        padding-inline-start: dt('tieredmenu.submenu.mobile.indent');
        padding-inline-end: 0;
    }

    .rs-cascadeselect-mobile-active .rs-cascadeselect-group-icon {
        transition: transform 0.2s;
        transform: rotate(90deg);
    }

    .rs-cascadeselect-mobile-active .rs-cascadeselect-option-active > .rs-cascadeselect-option-content .rs-cascadeselect-group-icon {
        transform: rotate(-90deg);
    }

    .rs-cascadeselect-sm .rs-cascadeselect-label {
        font-size: dt('cascadeselect.sm.font.size');
        padding-block: dt('cascadeselect.sm.padding.y');
        padding-inline: dt('cascadeselect.sm.padding.x');
    }

    .rs-cascadeselect-sm .rs-cascadeselect-dropdown .rs-icon {
        font-size: dt('cascadeselect.sm.font.size');
        width: dt('cascadeselect.sm.font.size');
        height: dt('cascadeselect.sm.font.size');
    }

    .rs-cascadeselect-lg .rs-cascadeselect-label {
        font-size: dt('cascadeselect.lg.font.size');
        padding-block: dt('cascadeselect.lg.padding.y');
        padding-inline: dt('cascadeselect.lg.padding.x');
    }

    .rs-cascadeselect-lg .rs-cascadeselect-dropdown .rs-icon {
        font-size: dt('cascadeselect.lg.font.size');
        width: dt('cascadeselect.lg.font.size');
        height: dt('cascadeselect.lg.font.size');
    }

    .rs-cascadeselect-fluid {
        display: flex;
    }

    .rs-cascadeselect-fluid .rs-cascadeselect-label {
        width: 1%;
    }

    .rs-cascadeselect-fluid .rs-cascadeselect-overlay .rs-cascadeselect-overlay {
         min-width: 12.5rem;
    }
`;
