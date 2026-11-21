export const style = /*css*/ `
    .rs-overlaybadge {
        position: relative;
    }

    .rs-overlaybadge .rs-badge {
        position: absolute;
        inset-block-start: 0;
        inset-inline-end: 0;
        transform: translate(50%, -50%);
        transform-origin: 100% 0;
        margin: 0;
        outline-width: dt('overlaybadge.outline.width');
        outline-style: solid;
        outline-color: dt('overlaybadge.outline.color');
    }

    .rs-overlaybadge .rs-badge:dir(rtl) {
        transform: translate(-50%, -50%);
    }
`;
