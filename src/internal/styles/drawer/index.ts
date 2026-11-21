export const style = /*css*/ `
    .rs-drawer {
        display: flex;
        flex-direction: column;
        transform: translate3d(0px, 0px, 0px);
        position: relative;
        transition: transform 0.3s;
        background: dt('drawer.background');
        color: dt('drawer.color');
        border-style: solid;
        border-color: dt('drawer.border.color');
        box-shadow: dt('drawer.shadow');
    }

    .rs-drawer-content {
        overflow-y: auto;
        flex-grow: 1;
        padding: dt('drawer.content.padding');
    }

    .rs-drawer[data-p-headless='true'] {
        overflow-y: auto;
    }

    .rs-drawer-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
        padding: dt('drawer.header.padding');
    }

    .rs-drawer-footer {
        padding: dt('drawer.footer.padding');
    }

    .rs-drawer-title {
        font-weight: dt('drawer.title.font.weight');
        font-size: dt('drawer.title.font.size');
    }

    .rs-drawer-full .rs-drawer {
        transition: none;
        transform: none;
        width: 100vw !important;
        height: 100vh !important;
        max-height: 100%;
        top: 0px !important;
        left: 0px !important;
        border-width: 1px;
    }

    .rs-drawer-left .rs-drawer-enter-active {
        animation: rs-animate-drawer-enter-left 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .rs-drawer-left .rs-drawer-leave-active {
        animation: rs-animate-drawer-leave-left 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }

    .rs-drawer-right .rs-drawer-enter-active {
        animation: rs-animate-drawer-enter-right 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .rs-drawer-right .rs-drawer-leave-active {
        animation: rs-animate-drawer-leave-right 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }

    .rs-drawer-top .rs-drawer-enter-active {
        animation: rs-animate-drawer-enter-top 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .rs-drawer-top .rs-drawer-leave-active {
        animation: rs-animate-drawer-leave-top 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }

    .rs-drawer-bottom .rs-drawer-enter-active {
        animation: rs-animate-drawer-enter-bottom 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .rs-drawer-bottom .rs-drawer-leave-active {
        animation: rs-animate-drawer-leave-bottom 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }

    .rs-drawer-full .rs-drawer-enter-active {
        animation: rs-animate-drawer-enter-full 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .rs-drawer-full .rs-drawer-leave-active {
        animation: rs-animate-drawer-leave-full 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }

    .rs-drawer-left .rs-drawer {
        width: 20rem;
        height: 100%;
        border-inline-end-width: 1px;
    }

    .rs-drawer-right .rs-drawer {
        width: 20rem;
        height: 100%;
        border-inline-start-width: 1px;
    }

    .rs-drawer-top .rs-drawer {
        height: 10rem;
        width: 100%;
        border-block-end-width: 1px;
    }

    .rs-drawer-bottom .rs-drawer {
        height: 10rem;
        width: 100%;
        border-block-start-width: 1px;
    }

    .rs-drawer-left .rs-drawer-content,
    .rs-drawer-right .rs-drawer-content,
    .rs-drawer-top .rs-drawer-content,
    .rs-drawer-bottom .rs-drawer-content {
        width: 100%;
        height: 100%;
    }

    .rs-drawer-open {
        display: flex;
    }

    .rs-drawer-mask:dir(rtl) {
        flex-direction: row-reverse;
    }

    @keyframes rs-animate-drawer-enter-left {
        from {
            transform: translate3d(-100%, 0px, 0px);
        }
    }

    @keyframes rs-animate-drawer-leave-left {
        to {
            transform: translate3d(-100%, 0px, 0px);
        }
    }

    @keyframes rs-animate-drawer-enter-right {
        from {
            transform: translate3d(100%, 0px, 0px);
        }
    }

    @keyframes rs-animate-drawer-leave-right {
        to {
            transform: translate3d(100%, 0px, 0px);
        }
    }

    @keyframes rs-animate-drawer-enter-top {
        from {
            transform: translate3d(0px, -100%, 0px);
        }
    }

    @keyframes rs-animate-drawer-leave-top {
        to {
            transform: translate3d(0px, -100%, 0px);
        }
    }

    @keyframes rs-animate-drawer-enter-bottom {
        from {
            transform: translate3d(0px, 100%, 0px);
        }
    }

    @keyframes rs-animate-drawer-leave-bottom {
        to {
            transform: translate3d(0px, 100%, 0px);
        }
    }

    @keyframes rs-animate-drawer-enter-full {
        from {
            opacity: 0;
            transform: scale(0.93);
        }
    }

    @keyframes rs-animate-drawer-leave-full {
        to {
            opacity: 0;
            transform: scale(0.93);
        }
    }
`;
