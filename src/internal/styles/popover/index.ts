export const style = /*css*/ `
    .rs-popover {
        margin-block-start: dt('popover.gutter');
        background: dt('popover.background');
        color: dt('popover.color');
        border: 1px solid dt('popover.border.color');
        border-radius: dt('popover.border.radius');
        box-shadow: dt('popover.shadow');
        will-change: transform;
    }

    .rs-popover-content {
        padding: dt('popover.content.padding');
    }

    .rs-popover-flipped {
        margin-block-start: calc(dt('popover.gutter') * -1);
        margin-block-end: dt('popover.gutter');
    }

    .rs-popover:after,
    .rs-popover:before {
        bottom: 100%;
        left: calc(dt('popover.arrow.offset') + dt('popover.arrow.left'));
        content: ' ';
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
    }

    .rs-popover:after {
        border-width: calc(dt('popover.gutter') - 2px);
        margin-left: calc(-1 * (dt('popover.gutter') - 2px));
        border-style: solid;
        border-color: transparent;
        border-bottom-color: dt('popover.background');
    }

    .rs-popover:before {
        border-width: dt('popover.gutter');
        margin-left: calc(-1 * dt('popover.gutter'));
        border-style: solid;
        border-color: transparent;
        border-bottom-color: dt('popover.border.color');
    }

    .rs-popover-flipped:after,
    .rs-popover-flipped:before {
        bottom: auto;
        top: 100%;
    }

    .rs-popover.rs-popover-flipped:after {
        border-bottom-color: transparent;
        border-top-color: dt('popover.background');
    }

    .rs-popover.rs-popover-flipped:before {
        border-bottom-color: transparent;
        border-top-color: dt('popover.border.color');
    }
`;
