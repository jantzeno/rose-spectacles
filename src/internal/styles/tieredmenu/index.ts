export const style = /*css*/ `
    .rs-tieredmenu {
        background: dt('tieredmenu.background');
        color: dt('tieredmenu.color');
        border: 1px solid dt('tieredmenu.border.color');
        border-radius: dt('tieredmenu.border.radius');
        min-width: 12.5rem;
    }


    .rs-tieredmenu-root-list,
    .rs-tieredmenu-submenu {
        margin: 0;
        padding: dt('tieredmenu.list.padding');
        list-style: none;
        outline: 0 none;
        display: flex;
        flex-direction: column;
        gap: dt('tieredmenu.list.gap');
    }

    .rs-tieredmenu-submenu {
        position: absolute;
        min-width: 100%;
        z-index: 1;
        background: dt('tieredmenu.background');
        color: dt('tieredmenu.color');
        border: 1px solid dt('tieredmenu.border.color');
        border-radius: dt('tieredmenu.border.radius');
        box-shadow: dt('tieredmenu.shadow');
    }

    .rs-tieredmenu-item {
        position: relative;
    }

    .rs-tieredmenu-item-content {
        transition:
            background dt('tieredmenu.transition.duration'),
            color dt('tieredmenu.transition.duration');
        border-radius: dt('tieredmenu.item.border.radius');
        color: dt('tieredmenu.item.color');
    }

    .rs-tieredmenu-item-link {
        cursor: pointer;
        display: flex;
        align-items: center;
        text-decoration: none;
        overflow: hidden;
        position: relative;
        color: inherit;
        padding: dt('tieredmenu.item.padding');
        gap: dt('tieredmenu.item.gap');
        user-select: none;
        outline: 0 none;
    }

    .rs-tieredmenu-item-label {
        line-height: 1;
    }

    .rs-tieredmenu-item-icon {
        color: dt('tieredmenu.item.icon.color');
    }

    .rs-tieredmenu-submenu-icon {
        color: dt('tieredmenu.submenu.icon.color');
        margin-left: auto;
        font-size: dt('tieredmenu.submenu.icon.size');
        width: dt('tieredmenu.submenu.icon.size');
        height: dt('tieredmenu.submenu.icon.size');
    }

    .rs-tieredmenu-submenu-icon:dir(rtl) {
        margin-left: 0;
        margin-right: auto;
    }

    .rs-tieredmenu-item.rs-focus > .rs-tieredmenu-item-content {
        color: dt('tieredmenu.item.focus.color');
        background: dt('tieredmenu.item.focus.background');
    }

    .rs-tieredmenu-item.rs-focus > .rs-tieredmenu-item-content .rs-tieredmenu-item-icon {
        color: dt('tieredmenu.item.icon.focus.color');
    }

    .rs-tieredmenu-item.rs-focus > .rs-tieredmenu-item-content .rs-tieredmenu-submenu-icon {
        color: dt('tieredmenu.submenu.icon.focus.color');
    }

    .rs-tieredmenu-item:not(.rs-disabled) > .rs-tieredmenu-item-content:hover {
        color: dt('tieredmenu.item.focus.color');
        background: dt('tieredmenu.item.focus.background');
    }

    .rs-tieredmenu-item:not(.rs-disabled) > .rs-tieredmenu-item-content:hover .rs-tieredmenu-item-icon {
        color: dt('tieredmenu.item.icon.focus.color');
    }

    .rs-tieredmenu-item:not(.rs-disabled) > .rs-tieredmenu-item-content:hover .rs-tieredmenu-submenu-icon {
        color: dt('tieredmenu.submenu.icon.focus.color');
    }

    .rs-tieredmenu-item-active > .rs-tieredmenu-item-content {
        color: dt('tieredmenu.item.active.color');
        background: dt('tieredmenu.item.active.background');
    }

    .rs-tieredmenu-item-active > .rs-tieredmenu-item-content .rs-tieredmenu-item-icon {
        color: dt('tieredmenu.item.icon.active.color');
    }

    .rs-tieredmenu-item-active > .rs-tieredmenu-item-content .rs-tieredmenu-submenu-icon {
        color: dt('tieredmenu.submenu.icon.active.color');
    }

    .rs-tieredmenu-separator {
        border-block-start: 1px solid dt('tieredmenu.separator.border.color');
    }

    .rs-tieredmenu-overlay {
        box-shadow: dt('tieredmenu.shadow');
        will-change: transform;
    }

    .rs-tieredmenu-mobile .rs-tieredmenu-submenu {
        position: static;
        box-shadow: none;
        border: 0 none;
        padding-inline-start: dt('tieredmenu.submenu.mobile.indent');
        padding-inline-end: 0;
    }

    .rs-tieredmenu-mobile .rs-tieredmenu-submenu:dir(rtl) {
        padding-inline-start: 0;
        padding-inline-end: dt('tieredmenu.submenu.mobile.indent');
    }

    .rs-tieredmenu-mobile .rs-tieredmenu-submenu-icon {
        transition: transform 0.2s;
        transform: rotate(90deg);
    }

    .rs-tieredmenu-mobile .rs-tieredmenu-item-active > .rs-tieredmenu-item-content .rs-tieredmenu-submenu-icon {
        transform: rotate(-90deg);
    }
`;
