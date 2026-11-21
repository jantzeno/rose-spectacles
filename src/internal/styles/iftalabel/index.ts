export const style = /*css*/ `
    .rs-iftalabel {
        display: block;
        position: relative;
    }

    .rs-iftalabel label {
        position: absolute;
        pointer-events: none;
        top: dt('iftalabel.top');
        transition-property: all;
        transition-timing-function: ease;
        line-height: 1;
        font-size: dt('iftalabel.font.size');
        font-weight: dt('iftalabel.font.weight');
        inset-inline-start: dt('iftalabel.position.x');
        color: dt('iftalabel.color');
        transition-duration: dt('iftalabel.transition.duration');
    }

    .rs-iftalabel .rs-inputtext,
    .rs-iftalabel .rs-textarea,
    .rs-iftalabel .rs-select-label,
    .rs-iftalabel .rs-multiselect-label,
    .rs-iftalabel .rs-multiselect-label:has(.rs-chip),
    .rs-iftalabel .rs-autocomplete-input-multiple,
    .rs-iftalabel .rs-cascadeselect-label,
    .rs-iftalabel .rs-treeselect-label {
        padding-block-start: dt('iftalabel.input.padding.top');
        padding-block-end: dt('iftalabel.input.padding.bottom');
    }

    .rs-iftalabel:has(.rs-invalid) label {
        color: dt('iftalabel.invalid.color');
    }

    .rs-iftalabel:has(input:focus) label,
    .rs-iftalabel:has(input:-webkit-autofill) label,
    .rs-iftalabel:has(textarea:focus) label,
    .rs-iftalabel:has(.rs-inputwrapper-focus) label {
        color: dt('iftalabel.focus.color');
    }

    .rs-iftalabel .rs-inputicon {
        top: dt('iftalabel.input.padding.top');
        transform: translateY(25%);
        margin-top: 0;
    }
`;
