export const style = /*css*/ `
    .rs-megamenu {
        position: relative;
        display: flex;
        align-items: center;
        background: dt('megamenu.background');
        border: 1px solid dt('megamenu.border.color');
        border-radius: dt('megamenu.border.radius');
        color: dt('megamenu.color');
        gap: dt('megamenu.gap');
    }

    .rs-megamenu-start,
    .rs-megamenu-end {
        display: flex;
        align-items: center;
    }

    .rs-megamenu-root-list {
        margin: 0;
        padding: 0;
        list-style: none;
        outline: 0 none;
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: dt('megamenu.gap');
    }

    .rs-megamenu-root-list > .rs-megamenu-item > .rs-megamenu-item-content {
        border-radius: dt('megamenu.base.item.border.radius');
    }

    .rs-megamenu-root-list > .rs-megamenu-item > .rs-megamenu-item-content > .rs-megamenu-item-link {
        padding: dt('megamenu.base.item.padding');
    }

    .rs-megamenu-item-content {
        transition:
            background dt('megamenu.transition.duration'),
            color dt('megamenu.transition.duration');
        border-radius: dt('megamenu.item.border.radius');
        color: dt('megamenu.item.color');
    }

    .rs-megamenu-item-link {
        cursor: pointer;
        display: flex;
        align-items: center;
        text-decoration: none;
        overflow: hidden;
        position: relative;
        color: inherit;
        padding: dt('megamenu.item.padding');
        gap: dt('megamenu.item.gap');
        user-select: none;
        outline: 0 none;
    }

    .rs-megamenu-item-label {
        line-height: 1;
    }

    .rs-megamenu-item-icon {
        color: dt('megamenu.item.icon.color');
    }

    .rs-megamenu-submenu-icon {
        color: dt('megamenu.submenu.icon.color');
        font-size: dt('megamenu.submenu.icon.size');
        width: dt('megamenu.submenu.icon.size');
        height: dt('megamenu.submenu.icon.size');
    }

    .rs-megamenu-item.rs-focus > .rs-megamenu-item-content {
        color: dt('megamenu.item.focus.color');
        background: dt('megamenu.item.focus.background');
    }

    .rs-megamenu-item.rs-focus > .rs-megamenu-item-content .rs-megamenu-item-icon {
        color: dt('megamenu.item.icon.focus.color');
    }

    .rs-megamenu-item.rs-focus > .rs-megamenu-item-content .rs-megamenu-submenu-icon {
        color: dt('megamenu.submenu.icon.focus.color');
    }

    .rs-megamenu-item:not(.rs-disabled) > .rs-megamenu-item-content:hover {
        color: dt('megamenu.item.focus.color');
        background: dt('megamenu.item.focus.background');
    }

    .rs-megamenu-item:not(.rs-disabled) > .rs-megamenu-item-content:hover .rs-megamenu-item-icon {
        color: dt('megamenu.item.icon.focus.color');
    }

    .rs-megamenu-item:not(.rs-disabled) > .rs-megamenu-item-content:hover .rs-megamenu-submenu-icon {
        color: dt('megamenu.submenu.icon.focus.color');
    }

    .rs-megamenu-item-active > .rs-megamenu-item-content {
        color: dt('megamenu.item.active.color');
        background: dt('megamenu.item.active.background');
    }

    .rs-megamenu-item-active > .rs-megamenu-item-content .rs-megamenu-item-icon {
        color: dt('megamenu.item.icon.active.color');
    }

    .rs-megamenu-item-active > .rs-megamenu-item-content .rs-megamenu-submenu-icon {
        color: dt('megamenu.submenu.icon.active.color');
    }

    .rs-megamenu-overlay {
        display: none;
        position: absolute;
        width: auto;
        z-index: 1;
        left: 0;
        min-width: 100%;
        padding: dt('megamenu.overlay.padding');
        background: dt('megamenu.overlay.background');
        color: dt('megamenu.overlay.color');
        border: 1px solid dt('megamenu.overlay.border.color');
        border-radius: dt('megamenu.overlay.border.radius');
        box-shadow: dt('megamenu.overlay.shadow');
    }

    .rs-megamenu-overlay:dir(rtl) {
        left: auto;
        right: 0;
    }

    .rs-megamenu-root-list > .rs-megamenu-item-active > .rs-megamenu-overlay {
        display: block;
    }

    .rs-megamenu-submenu {
        margin: 0;
        list-style: none;
        padding: dt('megamenu.submenu.padding');
        min-width: 12.5rem;
        display: flex;
        flex-direction: column;
        gap: dt('megamenu.submenu.gap');
    }

    .rs-megamenu-submenu-label {
        padding: dt('megamenu.submenu.label.padding');
        color: dt('megamenu.submenu.label.color');
        font-weight: dt('megamenu.submenu.label.font.weight');
        background: dt('megamenu.submenu.label.background');
    }

    .rs-megamenu-separator {
        border-block-start: 1px solid dt('megamenu.separator.border.color');
    }

    .rs-megamenu-horizontal {
        align-items: center;
        padding: dt('megamenu.horizontal.orientation.padding');
    }

    .rs-megamenu-horizontal .rs-megamenu-root-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: dt('megamenu.horizontal.orientation.gap');
    }

    .rs-megamenu-horizontal .rs-megamenu-end {
        margin-left: auto;
        align-self: center;
    }

    .rs-megamenu-horizontal .rs-megamenu-end:dir(rtl) {
        margin-left: 0;
        margin-right: auto;
    }

    .rs-megamenu-vertical {
        display: inline-flex;
        min-width: 12.5rem;
        flex-direction: column;
        align-items: stretch;
        padding: dt('megamenu.vertical.orientation.padding');
    }

    .rs-megamenu-vertical .rs-megamenu-root-list {
        align-items: stretch;
        flex-direction: column;
        gap: dt('megamenu.vertical.orientation.gap');
    }

    .rs-megamenu-vertical .rs-megamenu-root-list > .rs-megamenu-item-active > .rs-megamenu-overlay {
        left: 100%;
        top: 0;
    }

    .rs-megamenu-vertical .rs-megamenu-root-list > .rs-megamenu-item-active > .rs-megamenu-overlay:dir(rtl) {
        left: auto;
        right: 100%;
    }

    .rs-megamenu-vertical .rs-megamenu-root-list > .rs-megamenu-item > .rs-megamenu-item-content .rs-megamenu-submenu-icon {
        margin-left: auto;
    }

    .rs-megamenu-vertical .rs-megamenu-root-list > .rs-megamenu-item > .rs-megamenu-item-content .rs-megamenu-submenu-icon:dir(rtl) {
        margin-left: 0;
        margin-right: auto;
        transform: rotate(180deg);
    }

    .rs-megamenu-grid {
        display: flex;
    }

    .rs-megamenu-col-2,
    .rs-megamenu-col-3,
    .rs-megamenu-col-4,
    .rs-megamenu-col-6,
    .rs-megamenu-col-12 {
        flex: 0 0 auto;
        padding: dt('megamenu.overlay.gap');
    }

    .rs-megamenu-col-2 {
        width: 16.6667%;
    }

    .rs-megamenu-col-3 {
        width: 25%;
    }

    .rs-megamenu-col-4 {
        width: 33.3333%;
    }

    .rs-megamenu-col-6 {
        width: 50%;
    }

    .rs-megamenu-col-12 {
        width: 100%;
    }

    .rs-megamenu-button {
        display: none;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        width: dt('megamenu.mobile.button.size');
        height: dt('megamenu.mobile.button.size');
        position: relative;
        color: dt('megamenu.mobile.button.color');
        border: 0 none;
        background: transparent;
        border-radius: dt('megamenu.mobile.button.border.radius');
        transition:
            background dt('megamenu.transition.duration'),
            color dt('megamenu.transition.duration'),
            outline-color dt('megamenu.transition.duration'),
            box-shadow dt('megamenu.transition.duration');
        outline-color: transparent;
    }

    .rs-megamenu-button:hover {
        color: dt('megamenu.mobile.button.hover.color');
        background: dt('megamenu.mobile.button.hover.background');
    }

    .rs-megamenu-button:focus-visible {
        box-shadow: dt('megamenu.mobile.button.focus.ring.shadow');
        outline: dt('megamenu.mobile.button.focus.ring.width') dt('megamenu.mobile.button.focus.ring.style') dt('megamenu.mobile.button.focus.ring.color');
        outline-offset: dt('megamenu.mobile.button.focus.ring.offset');
    }

    .rs-megamenu-mobile {
        display: flex;
    }

    .rs-megamenu-mobile .rs-megamenu-button {
        display: flex;
    }

    .rs-megamenu-mobile .rs-megamenu-root-list {
        position: absolute;
        display: none;
        flex-direction: column;
        top: 100%;
        left: 0;
        z-index: 1;
        width: 100%;
        padding: dt('megamenu.submenu.padding');
        gap: dt('megamenu.submenu.gap');
        background: dt('megamenu.overlay.background');
        border: 1px solid dt('megamenu.overlay.border.color');
        box-shadow: dt('megamenu.overlay.shadow');
    }

    .rs-megamenu-mobile .rs-megamenu-root-list:dir(rtl) {
        left: auto;
        right: 0;
    }

    .rs-megamenu-mobile-active .rs-megamenu-root-list {
        display: block;
    }

    .rs-megamenu-mobile .rs-megamenu-root-list .rs-megamenu-item {
        width: 100%;
        position: static;
    }

    .rs-megamenu-mobile .rs-megamenu-overlay {
        position: static;
        border: 0 none;
        border-radius: 0;
        box-shadow: none;
    }

    .rs-megamenu-mobile .rs-megamenu-grid {
        flex-wrap: wrap;
        overflow: auto;
        max-height: 90%;
    }

    .rs-megamenu-mobile .rs-megamenu-root-list > .rs-megamenu-item > .rs-megamenu-item-content .rs-megamenu-submenu-icon {
        margin-left: auto;
        transition: transform 0.2s;
    }

    .rs-megamenu-mobile .rs-megamenu-root-list > .rs-megamenu-item > .rs-megamenu-item-content .rs-megamenu-submenu-icon:dir(rtl) {
        margin-left: 0;
        margin-right: auto;
    }

    .rs-megamenu-mobile .rs-megamenu-root-list > .rs-megamenu-item-active > .rs-megamenu-item-content .rs-megamenu-submenu-icon {
        transform: rotate(-180deg);
    }
`;
