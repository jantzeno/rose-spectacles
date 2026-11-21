export const style = /*css*/ `
    .rs-autocomplete {
        display: inline-flex;
    }

    .rs-autocomplete-loader {
        position: absolute;
        top: 50%;
        margin-top: -0.5rem;
        inset-inline-end: dt('autocomplete.padding.x');
    }

    .rs-autocomplete:has(.rs-autocomplete-dropdown) .rs-autocomplete-loader {
        inset-inline-end: calc(dt('autocomplete.dropdown.width') + dt('autocomplete.padding.x'));
    }

    .rs-autocomplete:has(.rs-autocomplete-dropdown) .rs-autocomplete-input {
        flex: 1 1 auto;
        width: 1%;
    }

    .rs-autocomplete:has(.rs-autocomplete-dropdown) .rs-autocomplete-input,
    .rs-autocomplete:has(.rs-autocomplete-dropdown) .rs-autocomplete-input-multiple {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
    }

    .rs-autocomplete-dropdown {
        cursor: pointer;
        display: inline-flex;
        user-select: none;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
        width: dt('autocomplete.dropdown.width');
        border-start-end-radius: dt('autocomplete.dropdown.border.radius');
        border-end-end-radius: dt('autocomplete.dropdown.border.radius');
        background: dt('autocomplete.dropdown.background');
        border: 1px solid dt('autocomplete.dropdown.border.color');
        border-inline-start: 0 none;
        color: dt('autocomplete.dropdown.color');
        transition:
            background dt('autocomplete.transition.duration'),
            color dt('autocomplete.transition.duration'),
            border-color dt('autocomplete.transition.duration'),
            outline-color dt('autocomplete.transition.duration'),
            box-shadow dt('autocomplete.transition.duration');
        outline-color: transparent;
    }

    .rs-autocomplete-dropdown:not(:disabled):hover {
        background: dt('autocomplete.dropdown.hover.background');
        border-color: dt('autocomplete.dropdown.hover.border.color');
        color: dt('autocomplete.dropdown.hover.color');
    }

    .rs-autocomplete-dropdown:not(:disabled):active {
        background: dt('autocomplete.dropdown.active.background');
        border-color: dt('autocomplete.dropdown.active.border.color');
        color: dt('autocomplete.dropdown.active.color');
    }

    .rs-autocomplete-dropdown:focus-visible {
        box-shadow: dt('autocomplete.dropdown.focus.ring.shadow');
        outline: dt('autocomplete.dropdown.focus.ring.width') dt('autocomplete.dropdown.focus.ring.style') dt('autocomplete.dropdown.focus.ring.color');
        outline-offset: dt('autocomplete.dropdown.focus.ring.offset');
    }

    .rs-autocomplete-overlay {
        position: absolute;
        top: 0;
        left: 0;
        background: dt('autocomplete.overlay.background');
        color: dt('autocomplete.overlay.color');
        border: 1px solid dt('autocomplete.overlay.border.color');
        border-radius: dt('autocomplete.overlay.border.radius');
        box-shadow: dt('autocomplete.overlay.shadow');
        min-width: 100%;
    }

    .rs-autocomplete-list-container {
        overflow: auto;
    }

    .rs-autocomplete-list {
        margin: 0;
        list-style-type: none;
        display: flex;
        flex-direction: column;
        gap: dt('autocomplete.list.gap');
        padding: dt('autocomplete.list.padding');
    }

    .rs-autocomplete-option {
        cursor: pointer;
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        padding: dt('autocomplete.option.padding');
        border: 0 none;
        color: dt('autocomplete.option.color');
        background: transparent;
        transition:
            background dt('autocomplete.transition.duration'),
            color dt('autocomplete.transition.duration'),
            border-color dt('autocomplete.transition.duration');
        border-radius: dt('autocomplete.option.border.radius');
    }

    .rs-autocomplete-option:not(.rs-autocomplete-option-selected):not(.rs-disabled).rs-focus {
        background: dt('autocomplete.option.focus.background');
        color: dt('autocomplete.option.focus.color');
    }

    .rs-autocomplete-option:not(.rs-autocomplete-option-selected):not(.rs-disabled):hover {
        background: dt('autocomplete.option.focus.background');
        color: dt('autocomplete.option.focus.color');
    }

    .rs-autocomplete-option-selected {
        background: dt('autocomplete.option.selected.background');
        color: dt('autocomplete.option.selected.color');
    }

    .rs-autocomplete-option-selected.rs-focus {
        background: dt('autocomplete.option.selected.focus.background');
        color: dt('autocomplete.option.selected.focus.color');
    }

    .rs-autocomplete-option-group {
        margin: 0;
        padding: dt('autocomplete.option.group.padding');
        color: dt('autocomplete.option.group.color');
        background: dt('autocomplete.option.group.background');
        font-weight: dt('autocomplete.option.group.font.weight');
    }

    .rs-autocomplete-input-multiple {
        margin: 0;
        list-style-type: none;
        cursor: text;
        overflow: hidden;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: calc(dt('autocomplete.padding.y') / 2) dt('autocomplete.padding.x');
        gap: calc(dt('autocomplete.padding.y') / 2);
        color: dt('autocomplete.color');
        background: dt('autocomplete.background');
        border: 1px solid dt('autocomplete.border.color');
        border-radius: dt('autocomplete.border.radius');
        width: 100%;
        transition:
            background dt('autocomplete.transition.duration'),
            color dt('autocomplete.transition.duration'),
            border-color dt('autocomplete.transition.duration'),
            outline-color dt('autocomplete.transition.duration'),
            box-shadow dt('autocomplete.transition.duration');
        outline-color: transparent;
        box-shadow: dt('autocomplete.shadow');
    }

    .rs-autocomplete-input-multiple.rs-disabled {
        opacity: 1;
        background: dt('autocomplete.disabled.background');
        color: dt('autocomplete.disabled.color');
    }

    .rs-autocomplete-input-multiple:not(.rs-disabled):hover {
        border-color: dt('autocomplete.hover.border.color');
    }

    .rs-autocomplete.rs-focus .rs-autocomplete-input-multiple:not(.rs-disabled) {
        border-color: dt('autocomplete.focus.border.color');
        box-shadow: dt('autocomplete.focus.ring.shadow');
        outline: dt('autocomplete.focus.ring.width') dt('autocomplete.focus.ring.style') dt('autocomplete.focus.ring.color');
        outline-offset: dt('autocomplete.focus.ring.offset');
    }

    .rs-autocomplete.rs-invalid .rs-autocomplete-input-multiple {
        border-color: dt('autocomplete.invalid.border.color');
    }

    .rs-variant-filled.rs-autocomplete-input-multiple {
        background: dt('autocomplete.filled.background');
    }

    .rs-autocomplete-input-multiple.rs-variant-filled:not(.rs-disabled):hover {
        background: dt('autocomplete.filled.hover.background');
    }

    .rs-autocomplete.rs-focus .rs-autocomplete-input-multiple.rs-variant-filled:not(.rs-disabled) {
        background: dt('autocomplete.filled.focus.background');
    }

    .rs-autocomplete-chip.rs-chip {
        padding-block-start: calc(dt('autocomplete.padding.y') / 2);
        padding-block-end: calc(dt('autocomplete.padding.y') / 2);
        border-radius: dt('autocomplete.chip.border.radius');
    }

    .rs-autocomplete-input-multiple:has(.rs-autocomplete-chip) {
        padding-inline-start: calc(dt('autocomplete.padding.y') / 2);
        padding-inline-end: calc(dt('autocomplete.padding.y') / 2);
    }

    .rs-autocomplete-chip-item.rs-focus .rs-autocomplete-chip {
        background: dt('autocomplete.chip.focus.background');
        color: dt('autocomplete.chip.focus.color');
    }

    .rs-autocomplete-input-chip {
        flex: 1 1 auto;
        display: inline-flex;
        padding-block-start: calc(dt('autocomplete.padding.y') / 2);
        padding-block-end: calc(dt('autocomplete.padding.y') / 2);
    }

    .rs-autocomplete-input-chip input {
        border: 0 none;
        outline: 0 none;
        background: transparent;
        margin: 0;
        padding: 0;
        box-shadow: none;
        border-radius: 0;
        width: 100%;
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: inherit;
    }

    .rs-autocomplete-input-chip input::placeholder {
        color: dt('autocomplete.placeholder.color');
    }

    .rs-autocomplete.rs-invalid .rs-autocomplete-input-chip input::placeholder {
        color: dt('autocomplete.invalid.placeholder.color');
    }

    .rs-autocomplete-empty-message {
        padding: dt('autocomplete.empty.message.padding');
    }

    .rs-autocomplete-fluid {
        display: flex;
    }

    .rs-autocomplete-fluid:has(.rs-autocomplete-dropdown) .rs-autocomplete-input {
        width: 1%;
    }

    .rs-autocomplete:has(.rs-inputtext-sm) .rs-autocomplete-dropdown {
        width: dt('autocomplete.dropdown.sm.width');
    }

    .rs-autocomplete:has(.rs-inputtext-sm) .rs-autocomplete-dropdown .rs-icon {
        font-size: dt('form.field.sm.font.size');
        width: dt('form.field.sm.font.size');
        height: dt('form.field.sm.font.size');
    }

    .rs-autocomplete:has(.rs-inputtext-lg) .rs-autocomplete-dropdown {
        width: dt('autocomplete.dropdown.lg.width');
    }

    .rs-autocomplete:has(.rs-inputtext-lg) .rs-autocomplete-dropdown .rs-icon {
        font-size: dt('form.field.lg.font.size');
        width: dt('form.field.lg.font.size');
        height: dt('form.field.lg.font.size');
    }

    .rs-autocomplete-clear-icon {
        position: absolute;
        top: 50%;
        margin-top: -0.5rem;
        cursor: pointer;
        color: dt('form.field.icon.color');
        inset-inline-end: dt('autocomplete.padding.x');
    }

    .rs-autocomplete:has(.rs-autocomplete-dropdown) .rs-autocomplete-clear-icon {
        inset-inline-end: calc(dt('autocomplete.padding.x') + dt('autocomplete.dropdown.width'));
    }

    .rs-autocomplete:has(.rs-autocomplete-clear-icon) .rs-autocomplete-input {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .rs-inputgroup .rs-autocomplete-dropdown {
        border-radius: 0;
    }

    .rs-inputgroup > .rs-autocomplete:last-child:has(.rs-autocomplete-dropdown) > .rs-autocomplete-input {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
    }

    .rs-inputgroup > .rs-autocomplete:last-child .rs-autocomplete-dropdown {
        border-start-end-radius: dt('autocomplete.dropdown.border.radius');
        border-end-end-radius: dt('autocomplete.dropdown.border.radius');
    }
`;
