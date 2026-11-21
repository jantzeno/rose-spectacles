export const style = /*css*/ `
    .rs-scrolltop.rs-button {
        position: fixed !important;
        inset-block-end: 20px;
        inset-inline-end: 20px;
    }

    .rs-scrolltop-sticky.rs-button {
        position: sticky !important;
        display: flex;
        margin-inline-start: auto;
    }

    .rs-scrolltop-enter-from {
        opacity: 0;
    }

    .rs-scrolltop-enter-active {
        transition: opacity 300ms;
    }

    .rs-scrolltop-leave-to {
        opacity: 0;
    }

    .rs-scrolltop-leave-active {
        transition: opacity 300ms;
    }
`;
