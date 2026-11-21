export const style = /*css*/ `
    .rs-floatlabel {
        display: block;
        position: relative;
    }

    .rs-floatlabel label {
        position: absolute;
        pointer-events: none;
        top: 50%;
        transform: translateY(-50%);
        transition-property: all;
        transition-timing-function: ease;
        line-height: 1;
        font-weight: dt('floatlabel.font.weight');
        inset-inline-start: dt('floatlabel.position.x');
        color: dt('floatlabel.color');
        transition-duration: dt('floatlabel.transition.duration');
    }

    .rs-floatlabel:has(.rs-textarea) label {
        top: dt('floatlabel.position.y');
        transform: translateY(0);
    }

    .rs-floatlabel:has(.rs-inputicon:first-child) label {
        inset-inline-start: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .rs-floatlabel:has(input:focus) label,
    .rs-floatlabel:has(input.rs-filled) label,
    .rs-floatlabel:has(input:-webkit-autofill) label,
    .rs-floatlabel:has(textarea:focus) label,
    .rs-floatlabel:has(textarea.rs-filled) label,
    .rs-floatlabel:has(.rs-inputwrapper-focus) label,
    .rs-floatlabel:has(.rs-inputwrapper-filled) label,
    .rs-floatlabel:has(input[placeholder]) label,
    .rs-floatlabel:has(textarea[placeholder]) label {
        top: dt('floatlabel.over.active.top');
        transform: translateY(0);
        font-size: dt('floatlabel.active.font.size');
        font-weight: dt('floatlabel.active.font.weight');
    }

    .rs-floatlabel:has(input.rs-filled) label,
    .rs-floatlabel:has(textarea.rs-filled) label,
    .rs-floatlabel:has(.rs-inputwrapper-filled) label {
        color: dt('floatlabel.active.color');
    }

    .rs-floatlabel:has(input:focus) label,
    .rs-floatlabel:has(input:-webkit-autofill) label,
    .rs-floatlabel:has(textarea:focus) label,
    .rs-floatlabel:has(.rs-inputwrapper-focus) label {
        color: dt('floatlabel.focus.color');
    }

    .rs-floatlabel-in .rs-inputtext,
    .rs-floatlabel-in .rs-textarea,
    .rs-floatlabel-in .rs-select-label,
    .rs-floatlabel-in .rs-multiselect-label,
    .rs-floatlabel-in .rs-multiselect-label:has(.rs-chip),
    .rs-floatlabel-in .rs-autocomplete-input-multiple,
    .rs-floatlabel-in .rs-cascadeselect-label,
    .rs-floatlabel-in .rs-treeselect-label {
        padding-block-start: dt('floatlabel.in.input.padding.top');
        padding-block-end: dt('floatlabel.in.input.padding.bottom');
    }

    .rs-floatlabel-in:has(input:focus) label,
    .rs-floatlabel-in:has(input.rs-filled) label,
    .rs-floatlabel-in:has(input:-webkit-autofill) label,
    .rs-floatlabel-in:has(textarea:focus) label,
    .rs-floatlabel-in:has(textarea.rs-filled) label,
    .rs-floatlabel-in:has(.rs-inputwrapper-focus) label,
    .rs-floatlabel-in:has(.rs-inputwrapper-filled) label,
    .rs-floatlabel-in:has(input[placeholder]) label,
    .rs-floatlabel-in:has(textarea[placeholder]) label {
        top: dt('floatlabel.in.active.top');
    }

    .rs-floatlabel-on:has(input:focus) label,
    .rs-floatlabel-on:has(input.rs-filled) label,
    .rs-floatlabel-on:has(input:-webkit-autofill) label,
    .rs-floatlabel-on:has(textarea:focus) label,
    .rs-floatlabel-on:has(textarea.rs-filled) label,
    .rs-floatlabel-on:has(.rs-inputwrapper-focus) label,
    .rs-floatlabel-on:has(.rs-inputwrapper-filled) label,
    .rs-floatlabel-on:has(input[placeholder]) label,
    .rs-floatlabel-on:has(textarea[placeholder]) label {
        top: 0;
        transform: translateY(-50%);
        border-radius: dt('floatlabel.on.border.radius');
        background: dt('floatlabel.on.active.background');
        padding: dt('floatlabel.on.active.padding');
    }

    .rs-floatlabel:has([class^='p-'][class$='-fluid']) {
        width: 100%;
    }

    .rs-floatlabel:has(.rs-invalid) label {
        color: dt('floatlabel.invalid.color');
    }
`;
