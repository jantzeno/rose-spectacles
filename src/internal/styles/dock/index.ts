export const style = /*css*/ `
    .rs-dock {
        position: absolute;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: none;
    }

    .rs-dock-list-container {
        display: flex;
        pointer-events: auto;
        background: dt('dock.background');
        border: 1px solid dt('dock.border.color');
        padding: dt('dock.padding');
        border-radius: dt('dock.border.radius');
    }

    .rs-dock-list {
        margin: 0;
        padding: 0;
        list-style: none;
        display: flex;
        align-items: center;
        justify-content: center;
        outline: 0 none;
    }

    .rs-dock-item {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: transform;
        padding: dt('dock.item.padding');
        border-radius: dt('dock.item.border.radius');
    }

    .rs-dock-item.rs-focus {
        box-shadow: dt('dock.item.focus.ring.shadow');
        outline: dt('dock.item.focus.ring.width') dt('dock.item.focus.ring.style') dt('dock.item.focus.ring.color');
        outline-offset: dt('dock.item.focus.ring.offset');
    }

    .rs-dock-item-link {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        cursor: default;
        width: dt('dock.item.size');
        height: dt('dock.item.size');
    }

    .rs-dock-top {
        left: 0;
        top: 0;
        width: 100%;
    }

    .rs-dock-bottom {
        left: 0;
        bottom: 0;
        width: 100%;
    }

    .rs-dock-right {
        right: 0;
        top: 0;
        height: 100%;
    }

    .rs-dock-right .rs-dock-list {
        flex-direction: column;
    }

    .rs-dock-left {
        left: 0;
        top: 0;
        height: 100%;
    }

    .rs-dock-left .rs-dock-list {
        flex-direction: column;
    }

    .rs-dock-mobile.rs-dock-top .rs-dock-list-container,
    .rs-dock-mobile.rs-dock-bottom .rs-dock-list-container {
        overflow-x: auto;
        width: 100%;
    }

    .rs-dock-mobile.rs-dock-top .rs-dock-list-container .rs-dock-list,
    .rs-dock-mobile.rs-dock-bottom .rs-dock-list-container .rs-dock-list {
        margin: 0 auto;
    }

    .rs-dock-mobile.rs-dock-left .rs-dock-list-container,
    .rs-dock-mobile.rs-dock-right .rs-dock-list-container {
        overflow-y: auto;
        height: 100%;
    }

    .rs-dock-mobile.rs-dock-left .rs-dock-list-container .rs-dock-list,
    .rs-dock-mobile.rs-dock-right .rs-dock-list-container .rs-dock-list {
        margin: auto 0;
    }

    .rs-dock-mobile .rs-dock-list .rs-dock-item {
        transform: none;
        margin: 0;
    }
`;
