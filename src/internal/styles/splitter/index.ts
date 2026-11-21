export const style = /*css*/ `
    .rs-splitter {
        display: flex;
        flex-wrap: nowrap;
        border: 1px solid dt('splitter.border.color');
        background: dt('splitter.background');
        border-radius: dt('border.radius.md');
        color: dt('splitter.color');
    }

    .rs-splitter-vertical {
        flex-direction: column;
    }

    .rs-splitter-gutter {
        flex-grow: 0;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
        background: dt('splitter.gutter.background');
    }

    .rs-splitter-gutter-handle {
        border-radius: dt('splitter.handle.border.radius');
        background: dt('splitter.handle.background');
        transition:
            outline-color dt('splitter.transition.duration'),
            box-shadow dt('splitter.transition.duration');
        outline-color: transparent;
    }

    .rs-splitter-gutter-handle:focus-visible {
        box-shadow: dt('splitter.handle.focus.ring.shadow');
        outline: dt('splitter.handle.focus.ring.width') dt('splitter.handle.focus.ring.style') dt('splitter.handle.focus.ring.color');
        outline-offset: dt('splitter.handle.focus.ring.offset');
    }

    .rs-splitter-horizontal.rs-splitter-resizing {
        cursor: col-resize;
        user-select: none;
    }

    .rs-splitter-vertical.rs-splitter-resizing {
        cursor: row-resize;
        user-select: none;
    }

    .rs-splitter-horizontal > .rs-splitter-gutter > .rs-splitter-gutter-handle {
        height: dt('splitter.handle.size');
        width: 100%;
    }

    .rs-splitter-vertical > .rs-splitter-gutter > .rs-splitter-gutter-handle {
        width: dt('splitter.handle.size');
        height: 100%;
    }

    .rs-splitter-horizontal > .rs-splitter-gutter {
        cursor: col-resize;
    }

    .rs-splitter-vertical > .rs-splitter-gutter {
        cursor: row-resize;
    }

    .rs-splitterpanel {
        flex-grow: 1;
        overflow: hidden;
    }

    .rs-splitterpanel-nested {
        display: flex;
    }

    .rs-splitterpanel .rs-splitter {
        flex-grow: 1;
        min-width: 0;
        min-height: 0;
        border: 0 none;
    }
`;
