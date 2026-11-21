export const style = /*css*/ `
    .rs-selectbutton {
        display: inline-flex;
        user-select: none;
        vertical-align: bottom;
        outline-color: transparent;
        border-radius: dt('selectbutton.border.radius');
    }

    .rs-selectbutton .rs-togglebutton {
        border-radius: 0;
        border-width: 1px 1px 1px 0;
    }

    .rs-selectbutton .rs-togglebutton:focus-visible {
        position: relative;
        z-index: 1;
    }

    .rs-selectbutton .rs-togglebutton:first-child {
        border-inline-start-width: 1px;
        border-start-start-radius: dt('selectbutton.border.radius');
        border-end-start-radius: dt('selectbutton.border.radius');
    }

    .rs-selectbutton .rs-togglebutton:last-child {
        border-start-end-radius: dt('selectbutton.border.radius');
        border-end-end-radius: dt('selectbutton.border.radius');
    }

    .rs-selectbutton.rs-invalid {
        outline: 1px solid dt('selectbutton.invalid.border.color');
        outline-offset: 0;
    }

    .rs-selectbutton-fluid {
        width: 100%;
    }

    .rs-selectbutton-fluid .rs-togglebutton {
        flex: 1 1 0;
    }
`;
