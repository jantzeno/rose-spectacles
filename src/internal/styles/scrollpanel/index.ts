export const style = /*css*/ `
    .rs-scrollpanel-content-container {
        overflow: hidden;
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 1;
        float: left;
    }

    .rs-scrollpanel-content {
        height: calc(100% + calc(2 * dt('scrollpanel.bar.size')));
        width: calc(100% + calc(2 * dt('scrollpanel.bar.size')));
        padding-inline: 0 calc(2 * dt('scrollpanel.bar.size'));
        padding-block: 0 calc(2 * dt('scrollpanel.bar.size'));
        position: relative;
        overflow: auto;
        box-sizing: border-box;
        scrollbar-width: none;
    }

    .rs-scrollpanel-content::-webkit-scrollbar {
        display: none;
    }

    .rs-scrollpanel-bar {
        position: relative;
        border-radius: dt('scrollpanel.bar.border.radius');
        z-index: 2;
        cursor: pointer;
        opacity: 0;
        outline-color: transparent;
        background: dt('scrollpanel.bar.background');
        border: 0 none;
        transition:
            outline-color dt('scrollpanel.transition.duration'),
            opacity dt('scrollpanel.transition.duration');
    }

    .rs-scrollpanel-bar:focus-visible {
        box-shadow: dt('scrollpanel.bar.focus.ring.shadow');
        outline: dt('scrollpanel.barfocus.ring.width') dt('scrollpanel.bar.focus.ring.style') dt('scrollpanel.bar.focus.ring.color');
        outline-offset: dt('scrollpanel.barfocus.ring.offset');
    }

    .rs-scrollpanel-bar-y {
        width: dt('scrollpanel.bar.size');
        inset-block-start: 0;
    }

    .rs-scrollpanel-bar-x {
        height: dt('scrollpanel.bar.size');
        inset-block-end: 0;
    }

    .rs-scrollpanel-hidden {
        visibility: hidden;
    }

    .rs-scrollpanel:hover .rs-scrollpanel-bar,
    .rs-scrollpanel:active .rs-scrollpanel-bar {
        opacity: 1;
    }

    .rs-scrollpanel-grabbed {
        user-select: none;
    }
`;
