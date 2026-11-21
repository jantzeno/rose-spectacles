export const style = /*css*/ `
    .rs-menubar {
        display: flex;
        align-items: center;
        background: dt('menubar.background');
        border: 1px solid dt('menubar.border.color');
        border-radius: dt('menubar.border.radius');
        color: dt('menubar.color');
        padding: dt('menubar.padding');
        gap: dt('menubar.gap');
    }

    .rs-menubar-start,
    .rs-megamenu-end {
        display: flex;
        align-items: center;
    }

    .rs-menubar-root-list,
    .rs-menubar-submenu {
        display: flex;
        margin: 0;
        padding: 0;
        list-style: none;
        outline: 0 none;
    }

    .rs-menubar-root-list {
        align-items: center;
        flex-wrap: wrap;
        gap: dt('menubar.gap');
    }

    .rs-menubar-root-list > .rs-menubar-item > .rs-menubar-item-content {
        border-radius: dt('menubar.base.item.border.radius');
    }

    .rs-menubar-root-list > .rs-menubar-item > .rs-menubar-item-content > .rs-menubar-item-link {
        padding: dt('menubar.base.item.padding');
    }

    .rs-menubar-item-content {
        transition:
            background dt('menubar.transition.duration'),
            color dt('menubar.transition.duration');
        border-radius: dt('menubar.item.border.radius');
        color: dt('menubar.item.color');
    }

    .rs-menubar-item-link {
        cursor: pointer;
        display: flex;
        align-items: center;
        text-decoration: none;
        overflow: hidden;
        position: relative;
        color: inherit;
        padding: dt('menubar.item.padding');
        gap: dt('menubar.item.gap');
        user-select: none;
        outline: 0 none;
    }

    .rs-menubar-item-label {
        line-height: 1;
    }

    .rs-menubar-item-icon {
        color: dt('menubar.item.icon.color');
    }

    .rs-menubar-submenu-icon {
        color: dt('menubar.submenu.icon.color');
        margin-left: auto;
        font-size: dt('menubar.submenu.icon.size');
        width: dt('menubar.submenu.icon.size');
        height: dt('menubar.submenu.icon.size');
    }

    .rs-menubar-submenu .rs-menubar-submenu-icon:dir(rtl) {
        margin-left: 0;
        margin-right: auto;
    }

    .rs-menubar-item.rs-focus > .rs-menubar-item-content {
        color: dt('menubar.item.focus.color');
        background: dt('menubar.item.focus.background');
    }

    .rs-menubar-item.rs-focus > .rs-menubar-item-content .rs-menubar-item-icon {
        color: dt('menubar.item.icon.focus.color');
    }

    .rs-menubar-item.rs-focus > .rs-menubar-item-content .rs-menubar-submenu-icon {
        color: dt('menubar.submenu.icon.focus.color');
    }

    .rs-menubar-item:not(.rs-disabled) > .rs-menubar-item-content:hover {
        color: dt('menubar.item.focus.color');
        background: dt('menubar.item.focus.background');
    }

    .rs-menubar-item:not(.rs-disabled) > .rs-menubar-item-content:hover .rs-menubar-item-icon {
        color: dt('menubar.item.icon.focus.color');
    }

    .rs-menubar-item:not(.rs-disabled) > .rs-menubar-item-content:hover .rs-menubar-submenu-icon {
        color: dt('menubar.submenu.icon.focus.color');
    }

    .rs-menubar-item-active > .rs-menubar-item-content {
        color: dt('menubar.item.active.color');
        background: dt('menubar.item.active.background');
    }

    .rs-menubar-item-active > .rs-menubar-item-content .rs-menubar-item-icon {
        color: dt('menubar.item.icon.active.color');
    }

    .rs-menubar-item-active > .rs-menubar-item-content .rs-menubar-submenu-icon {
        color: dt('menubar.submenu.icon.active.color');
    }

    .rs-menubar-submenu {
        display: none;
        position: absolute;
        min-width: 12.5rem;
        z-index: 1;
        background: dt('menubar.submenu.background');
        border: 1px solid dt('menubar.submenu.border.color');
        border-radius: dt('menubar.submenu.border.radius');
        box-shadow: dt('menubar.submenu.shadow');
        color: dt('menubar.submenu.color');
        flex-direction: column;
        padding: dt('menubar.submenu.padding');
        gap: dt('menubar.submenu.gap');
    }

    .rs-menubar-submenu .rs-menubar-separator {
        border-block-start: 1px solid dt('menubar.separator.border.color');
    }

    .rs-menubar-submenu .rs-menubar-item {
        position: relative;
    }

    .rs-menubar-submenu > .rs-menubar-item-active > .rs-menubar-submenu {
        display: block;
        left: 100%;
        top: 0;
    }

    .rs-menubar-end {
        margin-left: auto;
        align-self: center;
    }

    .rs-menubar-end:dir(rtl) {
        margin-left: 0;
        margin-right: auto;
    }

    .rs-menubar-button {
        display: none;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        width: dt('menubar.mobile.button.size');
        height: dt('menubar.mobile.button.size');
        position: relative;
        color: dt('menubar.mobile.button.color');
        border: 0 none;
        background: transparent;
        border-radius: dt('menubar.mobile.button.border.radius');
        transition:
            background dt('menubar.transition.duration'),
            color dt('menubar.transition.duration'),
            outline-color dt('menubar.transition.duration');
        outline-color: transparent;
    }

    .rs-menubar-button:hover {
        color: dt('menubar.mobile.button.hover.color');
        background: dt('menubar.mobile.button.hover.background');
    }

    .rs-menubar-button:focus-visible {
        box-shadow: dt('menubar.mobile.button.focus.ring.shadow');
        outline: dt('menubar.mobile.button.focus.ring.width') dt('menubar.mobile.button.focus.ring.style') dt('menubar.mobile.button.focus.ring.color');
        outline-offset: dt('menubar.mobile.button.focus.ring.offset');
    }

    .rs-menubar-mobile {
        position: relative;
    }

    .rs-menubar-mobile .rs-menubar-button {
        display: flex;
    }

    .rs-menubar-mobile .rs-menubar-root-list {
        position: absolute;
        display: none;
        width: 100%;
        flex-direction: column;
        top: 100%;
        left: 0;
        z-index: 1;
        padding: dt('menubar.submenu.padding');
        background: dt('menubar.submenu.background');
        border: 1px solid dt('menubar.submenu.border.color');
        box-shadow: dt('menubar.submenu.shadow');
        border-radius: dt('menubar.submenu.border.radius');
        gap: dt('menubar.submenu.gap');
    }

    .rs-menubar-mobile .rs-menubar-root-list:dir(rtl) {
        left: auto;
        right: 0;
    }

    .rs-menubar-mobile .rs-menubar-root-list > .rs-menubar-item > .rs-menubar-item-content > .rs-menubar-item-link {
        padding: dt('menubar.item.padding');
    }

    .rs-menubar-mobile-active .rs-menubar-root-list {
        display: flex;
    }

    .rs-menubar-mobile .rs-menubar-root-list .rs-menubar-item {
        width: 100%;
        position: static;
    }

    .rs-menubar-mobile .rs-menubar-root-list .rs-menubar-separator {
        border-block-start: 1px solid dt('menubar.separator.border.color');
    }

    .rs-menubar-mobile .rs-menubar-root-list > .rs-menubar-item > .rs-menubar-item-content .rs-menubar-submenu-icon {
        margin-left: auto;
        transition: transform 0.2s;
    }

    .rs-menubar-mobile .rs-menubar-root-list > .rs-menubar-item > .rs-menubar-item-content .rs-menubar-submenu-icon:dir(rtl),
    .rs-menubar-mobile .rs-menubar-submenu-icon:dir(rtl) {
        margin-left: 0;
        margin-right: auto;
    }

    .rs-menubar-mobile .rs-menubar-root-list > .rs-menubar-item-active > .rs-menubar-item-content .rs-menubar-submenu-icon {
        transform: rotate(-180deg);
    }

    .rs-menubar-mobile .rs-menubar-submenu .rs-menubar-submenu-icon {
        transition: transform 0.2s;
        transform: rotate(90deg);
    }

    .rs-menubar-mobile .rs-menubar-item-active > .rs-menubar-item-content .rs-menubar-submenu-icon {
        transform: rotate(-90deg);
    }

    .rs-menubar-mobile .rs-menubar-submenu {
        width: 100%;
        position: static;
        box-shadow: none;
        border: 0 none;
        padding-inline-start: dt('menubar.submenu.mobile.indent');
        padding-inline-end: 0;
    }
`;
