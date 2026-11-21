export const style = /*css*/ `
    .rs-menu {
        background: dt('menu.background');
        color: dt('menu.color');
        border: 1px solid dt('menu.border.color');
        border-radius: dt('menu.border.radius');
        min-width: 12.5rem;
    }

    .rs-menu-list {
        margin: 0;
        padding: dt('menu.list.padding');
        outline: 0 none;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: dt('menu.list.gap');
    }

    .rs-menu-item-content {
        transition:
            background dt('menu.transition.duration'),
            color dt('menu.transition.duration');
        border-radius: dt('menu.item.border.radius');
        color: dt('menu.item.color');
        overflow: hidden;
    }

    .rs-menu-item-link {
        cursor: pointer;
        display: flex;
        align-items: center;
        text-decoration: none;
        overflow: hidden;
        position: relative;
        color: inherit;
        padding: dt('menu.item.padding');
        gap: dt('menu.item.gap');
        user-select: none;
        outline: 0 none;
    }

    .rs-menu-item-label {
        line-height: 1;
    }

    .rs-menu-item-icon {
        color: dt('menu.item.icon.color');
    }

    .rs-menu-item.rs-focus .rs-menu-item-content {
        color: dt('menu.item.focus.color');
        background: dt('menu.item.focus.background');
    }

    .rs-menu-item.rs-focus .rs-menu-item-icon {
        color: dt('menu.item.icon.focus.color');
    }

    .rs-menu-item:not(.rs-disabled) .rs-menu-item-content:hover {
        color: dt('menu.item.focus.color');
        background: dt('menu.item.focus.background');
    }

    .rs-menu-item:not(.rs-disabled) .rs-menu-item-content:hover .rs-menu-item-icon {
        color: dt('menu.item.icon.focus.color');
    }

    .rs-menu-overlay {
        box-shadow: dt('menu.shadow');
    }

    .rs-menu-submenu-label {
        background: dt('menu.submenu.label.background');
        padding: dt('menu.submenu.label.padding');
        color: dt('menu.submenu.label.color');
        font-weight: dt('menu.submenu.label.font.weight');
    }

    .rs-menu-separator {
        border-block-start: 1px solid dt('menu.separator.border.color');
    }
`;
