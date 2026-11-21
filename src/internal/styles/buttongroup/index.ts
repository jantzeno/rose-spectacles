export const style = /*css*/ `
    .rs-buttongroup {
        display: inline-flex;
    }

    .rs-buttongroup .rs-button {
        margin: 0;
    }

    .rs-buttongroup .rs-button:not(:last-child),
    .rs-buttongroup .rs-button:not(:last-child):hover {
        border-inline-end: 0 none;
    }

    .rs-buttongroup .rs-button:not(:first-of-type):not(:last-of-type) {
        border-radius: 0;
    }

    .rs-buttongroup .rs-button:first-of-type:not(:only-of-type) {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
    }

    .rs-buttongroup .rs-button:last-of-type:not(:only-of-type) {
        border-start-start-radius: 0;
        border-end-start-radius: 0;
    }

    .rs-buttongroup .rs-button:focus {
        position: relative;
        z-index: 1;
    }
`;
