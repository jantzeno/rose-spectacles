export const style = /*css*/ `
    .rs-splitbutton {
        display: inline-flex;
        position: relative;
        border-radius: dt('splitbutton.border.radius');
    }

    .rs-splitbutton-button.rs-button {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
        border-inline-end: 0 none;
    }

    .rs-splitbutton-button.rs-button:focus-visible,
    .rs-splitbutton-dropdown.rs-button:focus-visible {
        z-index: 1;
    }

    .rs-splitbutton-button.rs-button:not(:disabled):hover,
    .rs-splitbutton-button.rs-button:not(:disabled):active {
        border-inline-end: 0 none;
    }

    .rs-splitbutton-dropdown.rs-button {
        border-start-start-radius: 0;
        border-end-start-radius: 0;
    }

    .rs-splitbutton .rs-menu {
        min-width: 100%;
    }

    .rs-splitbutton-fluid {
        display: flex;
    }

    .rs-splitbutton-rounded .rs-splitbutton-dropdown.rs-button {
        border-start-end-radius: dt('splitbutton.rounded.border.radius');
        border-end-end-radius: dt('splitbutton.rounded.border.radius');
    }

    .rs-splitbutton-rounded .rs-splitbutton-button.rs-button {
        border-start-start-radius: dt('splitbutton.rounded.border.radius');
        border-end-start-radius: dt('splitbutton.rounded.border.radius');
    }

    .rs-splitbutton-raised {
        box-shadow: dt('splitbutton.raised.shadow');
    }
`;
