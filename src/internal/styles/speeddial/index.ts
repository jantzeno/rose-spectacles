export const style = /*css*/ `
    .rs-speeddial {
        position: static;
        display: flex;
        gap: dt('speeddial.gap');
    }

    .rs-speeddial-button {
        z-index: 1;
    }

    .rs-speeddial-button.rs-speeddial-rotate {
        transition:
            transform 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
            background dt('speeddial.transition.duration'),
            color dt('speeddial.transition.duration'),
            border-color dt('speeddial.transition.duration'),
            box-shadow dt('speeddial.transition.duration'),
            outline-color dt('speeddial.transition.duration');
        will-change: transform;
    }

    .rs-speeddial-list {
        margin: 0;
        padding: 0;
        list-style: none;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: inset-block-start 0s linear dt('speeddial.transition.duration');
        pointer-events: none;
        outline: 0 none;
        z-index: 2;
        gap: dt('speeddial.gap');
    }

    .rs-speeddial-item {
        transform: scale(0);
        opacity: 0;
        transition:
            transform 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
            opacity 0.8s;
        will-change: transform;
    }

    .rs-speeddial-circle .rs-speeddial-item,
    .rs-speeddial-semi-circle .rs-speeddial-item,
    .rs-speeddial-quarter-circle .rs-speeddial-item {
        position: absolute;
    }

    .rs-speeddial-mask {
        position: absolute;
        border-radius: dt('content.border.radius');
    }

    .rs-speeddial-open .rs-speeddial-list {
        pointer-events: auto;
    }

    .rs-speeddial-open .rs-speeddial-item {
        transform: scale(1);
        opacity: 1;
    }

    .rs-speeddial-open .rs-speeddial-rotate {
        transform: rotate(45deg);
    }
`;
