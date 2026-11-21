export const style = /*css*/ `
    .rs-inputchips {
        display: inline-flex;
    }

    .rs-inputchips-input {
        margin: 0;
        list-style-type: none;
        cursor: text;
        overflow: hidden;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: calc(dt('inputchips.padding.y') / 2) dt('inputchips.padding.x');
        gap: calc(dt('inputchips.padding.y') / 2);
        color: dt('inputchips.color');
        background: dt('inputchips.background');
        border: 1px solid dt('inputchips.border.color');
        border-radius: dt('inputchips.border.radius');
        width: 100%;
        transition:
            background dt('inputchips.transition.duration'),
            color dt('inputchips.transition.duration'),
            border-color dt('inputchips.transition.duration'),
            outline-color dt('inputchips.transition.duration'),
            box-shadow dt('inputchips.transition.duration');
        outline-color: transparent;
        box-shadow: dt('inputchips.shadow');
    }

    .rs-inputchips:not(.rs-disabled):hover .rs-inputchips-input {
        border-color: dt('inputchips.hover.border.color');
    }

    .rs-inputchips:not(.rs-disabled).rs-focus .rs-inputchips-input {
        border-color: dt('inputchips.focus.border.color');
        box-shadow: dt('inputchips.focus.ring.shadow');
        outline: dt('inputchips.focus.ring.width') dt('inputchips.focus.ring.style') dt('inputchips.focus.ring.color');
        outline-offset: dt('inputchips.focus.ring.offset');
    }

    .rs-inputchips.rs-invalid .rs-inputchips-input {
        border-color: dt('inputchips.invalid.border.color');
    }

    .rs-variant-filled.rs-inputchips-input {
        background: dt('inputchips.filled.background');
    }

    .rs-inputchips:not(.rs-disabled).rs-focus .rs-variant-filled.rs-inputchips-input {
        background: dt('inputchips.filled.focus.background');
    }

    .rs-inputchips.rs-disabled .rs-inputchips-input {
        opacity: 1;
        background: dt('inputchips.disabled.background');
        color: dt('inputchips.disabled.color');
    }

    .rs-inputchips-chip.rs-chip {
        max-inline-size: 100%;
        padding-top: calc(dt('inputchips.padding.y') / 2);
        padding-bottom: calc(dt('inputchips.padding.y') / 2);
        border-radius: dt('inputchips.chip.border.radius');
        transition:
            background dt('inputchips.transition.duration'),
            color dt('inputchips.transition.duration');
    }

    .rs-inputchips-chip-item {
        min-inline-size: 0;
        max-inline-size: 100%;
    }

    .rs-inputchips-chip .rs-chip-label {
        min-inline-size: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .rs-inputchips-chip .rs-chip-remove-icon {
        flex-shrink: 0;
    }

    .rs-inputchips-chip-item.rs-focus .rs-inputchips-chip {
        background: dt('inputchips.chip.focus.background');
        color: dt('inputchips.chip.focus.color');
    }

    .rs-inputchips-input:has(.rs-inputchips-chip) {
        padding-left: calc(dt('inputchips.padding.y') / 2);
        padding-right: calc(dt('inputchips.padding.y') / 2);
    }

    .rs-inputchips-input-item {
        flex: 1 1 auto;
        display: inline-flex;
        padding-top: calc(dt('inputchips.padding.y') / 2);
        padding-bottom: calc(dt('inputchips.padding.y') / 2);
    }

    .rs-inputchips-input-item input {
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

    .rs-inputchips-input-item input::placeholder {
        color: dt('inputchips.placeholder.color');
    }
`;
