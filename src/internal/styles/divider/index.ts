export const style = /*css*/ `
    .rs-divider-horizontal {
        display: flex;
        width: 100%;
        position: relative;
        align-items: center;
        margin: dt('divider.horizontal.margin');
        padding: dt('divider.horizontal.padding');
    }

    .rs-divider-horizontal:before {
        position: absolute;
        display: block;
        inset-block-start: 50%;
        inset-inline-start: 0;
        width: 100%;
        content: '';
        border-block-start: 1px solid dt('divider.border.color');
    }

    .rs-divider-horizontal .rs-divider-content {
        padding: dt('divider.horizontal.content.padding');
    }

    .rs-divider-vertical {
        min-height: 100%;
        display: flex;
        position: relative;
        justify-content: center;
        margin: dt('divider.vertical.margin');
        padding: dt('divider.vertical.padding');
    }

    .rs-divider-vertical:before {
        position: absolute;
        display: block;
        inset-block-start: 0;
        inset-inline-start: 50%;
        height: 100%;
        content: '';
        border-inline-start: 1px solid dt('divider.border.color');
    }

    .rs-divider.rs-divider-vertical .rs-divider-content {
        padding: dt('divider.vertical.content.padding');
    }

    .rs-divider-content {
        z-index: 1;
        background: dt('divider.content.background');
        color: dt('divider.content.color');
    }

    .rs-divider-solid.rs-divider-horizontal:before {
        border-block-start-style: solid;
    }

    .rs-divider-solid.rs-divider-vertical:before {
        border-inline-start-style: solid;
    }

    .rs-divider-dashed.rs-divider-horizontal:before {
        border-block-start-style: dashed;
    }

    .rs-divider-dashed.rs-divider-vertical:before {
        border-inline-start-style: dashed;
    }

    .rs-divider-dotted.rs-divider-horizontal:before {
        border-block-start-style: dotted;
    }

    .rs-divider-dotted.rs-divider-vertical:before {
        border-inline-start-style: dotted;
    }

    .rs-divider-left:dir(rtl),
    .rs-divider-right:dir(rtl) {
        flex-direction: row-reverse;
    }
`;
