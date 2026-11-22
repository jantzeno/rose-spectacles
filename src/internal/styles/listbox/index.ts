export const style = /*css*/ `
    .rs-listbox {
        display: block;
        background: dt('listbox.background');
        color: dt('listbox.color');
        border: 1px solid dt('listbox.border.color');
        border-radius: dt('listbox.border.radius');
        transition:
            background dt('listbox.transition.duration'),
            color dt('listbox.transition.duration'),
            border-color dt('listbox.transition.duration'),
            box-shadow dt('listbox.transition.duration'),
            outline-color dt('listbox.transition.duration');
        outline-color: transparent;
        box-shadow: dt('listbox.shadow');
    }

    .rs-listbox.rs-disabled {
        opacity: 1;
        background: dt('listbox.disabled.background');
        color: dt('listbox.disabled.color');
    }

    .rs-listbox.rs-disabled .rs-listbox-option {
        color: dt('listbox.disabled.color');
    }

    .rs-listbox.rs-invalid {
        border-color: dt('listbox.invalid.border.color');
    }

    .rs-listbox-header {
        padding: dt('listbox.list.header.padding');
    }

    .rs-listbox-filter {
        width: 100%;
    }

    .rs-listbox-list-container {
        overflow: auto;
    }

    .rs-listbox-list {
        list-style-type: none;
        margin: 0;
        padding: dt('listbox.list.padding');
        outline: 0 none;
        display: flex;
        flex-direction: column;
        gap: dt('listbox.list.gap');
    }

    .rs-listbox-group,
    .rs-listbox-group > ul {
        display: flex;
        flex-direction: column;
        gap: inherit;
    }

    .rs-listbox-option {
        display: flex;
        align-items: center;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        padding: dt('listbox.option.padding');
        border: 0 none;
        border-radius: dt('listbox.option.border.radius');
        color: dt('listbox.option.color');
        transition:
            background dt('listbox.transition.duration'),
            color dt('listbox.transition.duration'),
            border-color dt('listbox.transition.duration'),
            box-shadow dt('listbox.transition.duration'),
            outline-color dt('listbox.transition.duration');
    }

    .rs-listbox-striped .rs-listbox-option[data-p-even-option="true"] {
        background: dt('listbox.option.striped.background');
    }

    .rs-listbox .rs-listbox-list .rs-listbox-option.rs-listbox-option-selected {
        background: dt('listbox.option.selected.background');
        color: dt('listbox.option.selected.color');
    }

    .rs-listbox:not(.rs-disabled) .rs-listbox-option.rs-listbox-option-selected.rs-focus {
        background: dt('listbox.option.selected.focus.background');
        color: dt('listbox.option.selected.focus.color');
    }

    .rs-listbox:not(.rs-disabled) .rs-listbox-option:not(.rs-listbox-option-selected):not(.rs-disabled).rs-focus {
        background: dt('listbox.option.focus.background');
        color: dt('listbox.option.focus.color');
    }

    .rs-listbox:not(.rs-disabled) .rs-listbox-option:not(.rs-listbox-option-selected):not(.rs-disabled):hover {
        background: dt('listbox.option.focus.background');
        color: dt('listbox.option.focus.color');
    }

    .rs-listbox-option-blank-icon {
        flex-shrink: 0;
        inline-size: var(--rs-icon-size, 14px);
    }

    .rs-listbox-option-check-icon {
        position: relative;
        flex-shrink: 0;
        margin-inline-start: dt('listbox.checkmark.gutter.start');
        margin-inline-end: dt('listbox.checkmark.gutter.end');
        color: dt('listbox.checkmark.color');
    }

    .rs-listbox-option-group {
        margin: 0;
        padding: dt('listbox.option.group.padding');
        color: dt('listbox.option.group.color');
        background: dt('listbox.option.group.background');
        font-weight: dt('listbox.option.group.font.weight');
    }

    .rs-listbox-empty-message {
        padding: dt('listbox.empty.message.padding');
    }

    .rs-listbox-fluid {
        width: 100%;
    }
`;
