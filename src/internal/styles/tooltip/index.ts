export const style = /*css*/ `
    .rs-tooltip {
        position: absolute;
        display: none;
        max-width: dt('tooltip.max.width');
    }

    .rs-tooltip-right,
    .rs-tooltip-left {
        padding: 0 dt('tooltip.gutter');
    }

    .rs-tooltip-top,
    .rs-tooltip-bottom {
        padding: dt('tooltip.gutter') 0;
    }

    .rs-tooltip-text {
        white-space: pre-line;
        word-break: break-word;
        background: dt('tooltip.background');
        color: dt('tooltip.color');
        padding: dt('tooltip.padding');
        box-shadow: dt('tooltip.shadow');
        border-radius: dt('tooltip.border.radius');
    }

    .rs-tooltip-arrow {
        position: absolute;
        width: 0;
        height: 0;
        border-color: transparent;
        border-style: solid;
    }

    .rs-tooltip-right .rs-tooltip-arrow {
        margin-top: calc(-1 * dt('tooltip.gutter'));
        border-width: dt('tooltip.gutter') dt('tooltip.gutter') dt('tooltip.gutter') 0;
        border-right-color: dt('tooltip.background');
    }

    .rs-tooltip-left .rs-tooltip-arrow {
        margin-top: calc(-1 * dt('tooltip.gutter'));
        border-width: dt('tooltip.gutter') 0 dt('tooltip.gutter') dt('tooltip.gutter');
        border-left-color: dt('tooltip.background');
    }

    .rs-tooltip-top .rs-tooltip-arrow {
        margin-left: calc(-1 * dt('tooltip.gutter'));
        border-width: dt('tooltip.gutter') dt('tooltip.gutter') 0 dt('tooltip.gutter');
        border-top-color: dt('tooltip.background');
        border-bottom-color: dt('tooltip.background');
    }

    .rs-tooltip-bottom .rs-tooltip-arrow {
        margin-left: calc(-1 * dt('tooltip.gutter'));
        border-width: 0 dt('tooltip.gutter') dt('tooltip.gutter') dt('tooltip.gutter');
        border-top-color: dt('tooltip.background');
        border-bottom-color: dt('tooltip.background');
    }
`;
