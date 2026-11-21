export const style = /*css*/ `
    .rs-breadcrumb {
        background: dt('breadcrumb.background');
        padding: dt('breadcrumb.padding');
        overflow-x: auto;
    }

    .rs-breadcrumb-list {
        margin: 0;
        padding: 0;
        list-style-type: none;
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        gap: dt('breadcrumb.gap');
    }

    .rs-breadcrumb-separator {
        display: flex;
        align-items: center;
        color: dt('breadcrumb.separator.color');
    }

    .rs-breadcrumb-separator-icon:dir(rtl) {
        transform: rotate(180deg);
    }

    .rs-breadcrumb::-webkit-scrollbar {
        display: none;
    }

    .rs-breadcrumb-item-link {
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: dt('breadcrumb.item.gap');
        transition:
            background dt('breadcrumb.transition.duration'),
            color dt('breadcrumb.transition.duration'),
            outline-color dt('breadcrumb.transition.duration'),
            box-shadow dt('breadcrumb.transition.duration');
        border-radius: dt('breadcrumb.item.border.radius');
        outline-color: transparent;
        color: dt('breadcrumb.item.color');
    }

    .rs-breadcrumb-item-link:focus-visible {
        box-shadow: dt('breadcrumb.item.focus.ring.shadow');
        outline: dt('breadcrumb.item.focus.ring.width') dt('breadcrumb.item.focus.ring.style') dt('breadcrumb.item.focus.ring.color');
        outline-offset: dt('breadcrumb.item.focus.ring.offset');
    }

    .rs-breadcrumb-item-link:hover .rs-breadcrumb-item-label {
        color: dt('breadcrumb.item.hover.color');
    }

    .rs-breadcrumb-item-label {
        transition: inherit;
    }

    .rs-breadcrumb-item-icon {
        color: dt('breadcrumb.item.icon.color');
        transition: inherit;
    }

    .rs-breadcrumb-item-link:hover .rs-breadcrumb-item-icon {
        color: dt('breadcrumb.item.icon.hover.color');
    }
`;
