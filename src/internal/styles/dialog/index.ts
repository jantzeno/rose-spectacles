export const style = /*css*/ `
    .rs-dialog {
        max-height: 90%;
        transform: scale(1);
        border-radius: dt('dialog.border.radius');
        box-shadow: dt('dialog.shadow');
        background: dt('dialog.background');
        border: 1px solid dt('dialog.border.color');
        color: dt('dialog.color');
        will-change: transform;
    }

    .rs-dialog-content {
        overflow-y: auto;
        padding: dt('dialog.content.padding');
        flex-grow: 1;
    }

    .rs-dialog-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
        padding: dt('dialog.header.padding');
    }

    .rs-dialog-title {
        font-weight: dt('dialog.title.font.weight');
        font-size: dt('dialog.title.font.size');
    }

    .rs-dialog-footer {
        flex-shrink: 0;
        padding: dt('dialog.footer.padding');
        display: flex;
        justify-content: flex-end;
        gap: dt('dialog.footer.gap');
    }

    .rs-dialog-header-actions {
        display: flex;
        align-items: center;
        gap: dt('dialog.header.gap');
    }

    .rs-dialog-top .rs-dialog,
    .rs-dialog-bottom .rs-dialog,
    .rs-dialog-left .rs-dialog,
    .rs-dialog-right .rs-dialog,
    .rs-dialog-topleft .rs-dialog,
    .rs-dialog-topright .rs-dialog,
    .rs-dialog-bottomleft .rs-dialog,
    .rs-dialog-bottomright .rs-dialog {
        margin: 1rem;
    }

    .rs-dialog-maximized {
        width: 100vw !important;
        height: 100vh !important;
        top: 0px !important;
        left: 0px !important;
        max-height: 100%;
        height: 100%;
        border-radius: 0;
    }

    .rs-dialog .rs-resizable-handle {
        position: absolute;
        font-size: 0.1px;
        display: block;
        cursor: se-resize;
        width: 12px;
        height: 12px;
        right: 1px;
        bottom: 1px;
    }

    .rs-dialog-enter-active {
        animation: rs-animate-dialog-enter 300ms cubic-bezier(.19,1,.22,1);
    }

    .rs-dialog-leave-active {
        animation: rs-animate-dialog-leave 300ms cubic-bezier(.19,1,.22,1);
    }

    @keyframes rs-animate-dialog-enter {
        from {
            opacity: 0;
            transform: scale(0.93);
        }
    }

    @keyframes rs-animate-dialog-leave {
        to {
            opacity: 0;
            transform: scale(0.93);
        }
    }
`;
