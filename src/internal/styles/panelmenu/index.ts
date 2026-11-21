export const style = /*css*/ `
    .rs-panelmenu {
        display: flex;
        flex-direction: column;
        gap: dt('panelmenu.gap');
    }

    .rs-panelmenu-panel {
        background: dt('panelmenu.panel.background');
        border-width: dt('panelmenu.panel.border.width');
        border-style: solid;
        border-color: dt('panelmenu.panel.border.color');
        color: dt('panelmenu.panel.color');
        border-radius: dt('panelmenu.panel.border.radius');
        padding: dt('panelmenu.panel.padding');
    }

    .rs-panelmenu-panel:first-child {
        border-width: dt('panelmenu.panel.first.border.width');
        border-start-start-radius: dt('panelmenu.panel.first.top.border.radius');
        border-start-end-radius: dt('panelmenu.panel.first.top.border.radius');
    }

    .rs-panelmenu-panel:last-child {
        border-width: dt('panelmenu.panel.last.border.width');
        border-end-start-radius: dt('panelmenu.panel.last.bottom.border.radius');
        border-end-end-radius: dt('panelmenu.panel.last.bottom.border.radius');
    }

    .rs-panelmenu-header {
        outline: 0 none;
    }

    .rs-panelmenu-header-content {
        border-radius: dt('panelmenu.item.border.radius');
        transition:
            background dt('panelmenu.transition.duration'),
            color dt('panelmenu.transition.duration'),
            outline-color dt('panelmenu.transition.duration'),
            box-shadow dt('panelmenu.transition.duration');
        outline-color: transparent;
        color: dt('panelmenu.item.color');
    }

    .rs-panelmenu-header-link {
        display: flex;
        gap: dt('panelmenu.item.gap');
        padding: dt('panelmenu.item.padding');
        align-items: center;
        user-select: none;
        cursor: pointer;
        position: relative;
        text-decoration: none;
        color: inherit;
    }

    .rs-panelmenu-header-icon,
    .rs-panelmenu-item-icon {
        color: dt('panelmenu.item.icon.color');
    }

    .rs-panelmenu-submenu-icon {
        color: dt('panelmenu.submenu.icon.color');
    }

    .rs-panelmenu-submenu-icon:dir(rtl) {
        transform: rotate(180deg);
    }

    .rs-panelmenu-header:not(.rs-disabled):focus-visible .rs-panelmenu-header-content {
        background: dt('panelmenu.item.focus.background');
        color: dt('panelmenu.item.focus.color');
    }

    .rs-panelmenu-header:not(.rs-disabled):focus-visible .rs-panelmenu-header-content .rs-panelmenu-header-icon {
        color: dt('panelmenu.item.icon.focus.color');
    }

    .rs-panelmenu-header:not(.rs-disabled):focus-visible .rs-panelmenu-header-content .rs-panelmenu-submenu-icon {
        color: dt('panelmenu.submenu.icon.focus.color');
    }

    .rs-panelmenu-header:not(.rs-disabled) .rs-panelmenu-header-content:hover {
        background: dt('panelmenu.item.focus.background');
        color: dt('panelmenu.item.focus.color');
    }

    .rs-panelmenu-header:not(.rs-disabled) .rs-panelmenu-header-content:hover .rs-panelmenu-header-icon {
        color: dt('panelmenu.item.icon.focus.color');
    }

    .rs-panelmenu-header:not(.rs-disabled) .rs-panelmenu-header-content:hover .rs-panelmenu-submenu-icon {
        color: dt('panelmenu.submenu.icon.focus.color');
    }

    .rs-panelmenu-submenu {
        margin: 0;
        padding: 0 0 0 dt('panelmenu.submenu.indent');
        outline: 0;
        list-style: none;
    }

    .rs-panelmenu-submenu:dir(rtl) {
        padding: 0 dt('panelmenu.submenu.indent') 0 0;
    }

    .rs-panelmenu-item-link {
        display: flex;
        gap: dt('panelmenu.item.gap');
        padding: dt('panelmenu.item.padding');
        align-items: center;
        user-select: none;
        cursor: pointer;
        text-decoration: none;
        color: inherit;
        position: relative;
        overflow: hidden;
    }

    .rs-panelmenu-item-label {
        line-height: 1;
    }

    .rs-panelmenu-item-content {
        border-radius: dt('panelmenu.item.border.radius');
        transition:
            background dt('panelmenu.transition.duration'),
            color dt('panelmenu.transition.duration'),
            outline-color dt('panelmenu.transition.duration'),
            box-shadow dt('panelmenu.transition.duration');
        color: dt('panelmenu.item.color');
        outline-color: transparent;
    }

    .rs-panelmenu-item.rs-focus > .rs-panelmenu-item-content {
        background: dt('panelmenu.item.focus.background');
        color: dt('panelmenu.item.focus.color');
    }

    .rs-panelmenu-item.rs-focus > .rs-panelmenu-item-content .rs-panelmenu-item-icon {
        color: dt('panelmenu.item.focus.color');
    }

    .rs-panelmenu-item.rs-focus > .rs-panelmenu-item-content .rs-panelmenu-submenu-icon {
        color: dt('panelmenu.submenu.icon.focus.color');
    }

    .rs-panelmenu-item:not(.rs-disabled) > .rs-panelmenu-item-content:hover {
        background: dt('panelmenu.item.focus.background');
        color: dt('panelmenu.item.focus.color');
    }

    .rs-panelmenu-item:not(.rs-disabled) > .rs-panelmenu-item-content:hover .rs-panelmenu-item-icon {
        color: dt('panelmenu.item.icon.focus.color');
    }

    .rs-panelmenu-item:not(.rs-disabled) > .rs-panelmenu-item-content:hover .rs-panelmenu-submenu-icon {
        color: dt('panelmenu.submenu.icon.focus.color');
    }

    .rs-panelmenu-content-container {
        display: grid;
        grid-template-rows: 1fr;
    }

    .rs-panelmenu-content-wrapper {
        min-height: 0;
    }
`;
