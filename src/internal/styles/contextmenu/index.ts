export const style = /*css*/ `
    .rs-contextmenu {
        background: dt('contextmenu.background');
        color: dt('contextmenu.color');
        border: 1px solid dt('contextmenu.border.color');
        border-radius: dt('contextmenu.border.radius');
        box-shadow: dt('contextmenu.shadow');
        min-width: 12.5rem;
    }

    .rs-contextmenu-root-list,
    .rs-contextmenu-submenu {
        margin: 0;
        padding: dt('contextmenu.list.padding');
        list-style: none;
        outline: 0 none;
        display: flex;
        flex-direction: column;
        gap: dt('contextmenu.list.gap');
    }

    .rs-contextmenu-submenu {
        position: absolute;
        display: flex;
        flex-direction: column;
        min-width: 100%;
        z-index: 1;
        background: dt('contextmenu.background');
        color: dt('contextmenu.color');
        border: 1px solid dt('contextmenu.border.color');
        border-radius: dt('contextmenu.border.radius');
        box-shadow: dt('contextmenu.shadow');
    }

    .rs-contextmenu-item {
        position: relative;
    }

    .rs-contextmenu-item-content {
        transition:
            background dt('contextmenu.transition.duration'),
            color dt('contextmenu.transition.duration');
        border-radius: dt('contextmenu.item.border.radius');
        color: dt('contextmenu.item.color');
    }

    .rs-contextmenu-item-link {
        cursor: pointer;
        display: flex;
        align-items: center;
        text-decoration: none;
        overflow: hidden;
        position: relative;
        color: inherit;
        padding: dt('contextmenu.item.padding');
        gap: dt('contextmenu.item.gap');
        user-select: none;
    }

    .rs-contextmenu-item-label {
        line-height: 1;
    }

    .rs-contextmenu-item-icon {
        color: dt('contextmenu.item.icon.color');
    }

    .rs-contextmenu-submenu-icon {
        color: dt('contextmenu.submenu.icon.color');
        margin-left: auto;
        font-size: dt('contextmenu.submenu.icon.size');
        width: dt('contextmenu.submenu.icon.size');
        height: dt('contextmenu.submenu.icon.size');
    }

    .rs-contextmenu-submenu-icon:dir(rtl) {
        margin-left: 0;
        margin-right: auto;
    }

    .rs-contextmenu-item.rs-focus > .rs-contextmenu-item-content {
        color: dt('contextmenu.item.focus.color');
        background: dt('contextmenu.item.focus.background');
    }

    .rs-contextmenu-item.rs-focus > .rs-contextmenu-item-content .rs-contextmenu-item-icon {
        color: dt('contextmenu.item.icon.focus.color');
    }

    .rs-contextmenu-item.rs-focus > .rs-contextmenu-item-content .rs-contextmenu-submenu-icon {
        color: dt('contextmenu.submenu.icon.focus.color');
    }

    .rs-contextmenu-item:not(.rs-disabled) > .rs-contextmenu-item-content:hover {
        color: dt('contextmenu.item.focus.color');
        background: dt('contextmenu.item.focus.background');
    }

    .rs-contextmenu-item:not(.rs-disabled) > .rs-contextmenu-item-content:hover .rs-contextmenu-item-icon {
        color: dt('contextmenu.item.icon.focus.color');
    }

    .rs-contextmenu-item:not(.rs-disabled) > .rs-contextmenu-item-content:hover .rs-contextmenu-submenu-icon {
        color: dt('contextmenu.submenu.icon.focus.color');
    }

    .rs-contextmenu-item-active > .rs-contextmenu-item-content {
        color: dt('contextmenu.item.active.color');
        background: dt('contextmenu.item.active.background');
    }

    .rs-contextmenu-item-active > .rs-contextmenu-item-content .rs-contextmenu-item-icon {
        color: dt('contextmenu.item.icon.active.color');
    }

    .rs-contextmenu-item-active > .rs-contextmenu-item-content .rs-contextmenu-submenu-icon {
        color: dt('contextmenu.submenu.icon.active.color');
    }

    .rs-contextmenu-separator {
        border-block-start: 1px solid dt('contextmenu.separator.border.color');
    }

    .rs-contextmenu-mobile .rs-contextmenu-submenu {
        position: static;
        box-shadow: none;
        border: 0 none;
        padding-inline-start: dt('tieredmenu.submenu.mobile.indent');
        padding-inline-end: 0;
    }

    .rs-contextmenu-mobile .rs-contextmenu-submenu-icon {
        transition: transform 0.2s;
        transform: rotate(90deg);
    }

    .rs-contextmenu-mobile .rs-contextmenu-item-active > .rs-contextmenu-item-content .rs-contextmenu-submenu-icon {
        transform: rotate(-90deg);
    }
`;
