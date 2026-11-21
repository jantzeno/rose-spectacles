export const style = /*css*/ `
    .rs-galleria {
        overflow: hidden;
        border-style: solid;
        border-width: dt('galleria.border.width');
        border-color: dt('galleria.border.color');
        border-radius: dt('galleria.border.radius');
    }

    .rs-galleria-content {
        display: flex;
        flex-direction: column;
    }

    .rs-galleria-items-container {
        display: flex;
        flex-direction: column;
        position: relative;
    }

    .rs-galleria-items {
        position: relative;
        display: flex;
        height: 100%;
    }

    .rs-galleria-nav-button {
        position: absolute !important;
        top: 50%;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        background: dt('galleria.nav.button.background');
        color: dt('galleria.nav.button.color');
        width: dt('galleria.nav.button.size');
        height: dt('galleria.nav.button.size');
        transition:
            background dt('galleria.transition.duration'),
            color dt('galleria.transition.duration'),
            outline-color dt('galleria.transition.duration'),
            box-shadow dt('galleria.transition.duration');
        margin: calc(-1 * calc(dt('galleria.nav.button.size')) / 2) dt('galleria.nav.button.gutter') 0 dt('galleria.nav.button.gutter');
        padding: 0;
        user-select: none;
        border: 0 none;
        cursor: pointer;
        outline-color: transparent;
    }

    .rs-galleria-nav-button:not(.rs-disabled):hover {
        background: dt('galleria.nav.button.hover.background');
        color: dt('galleria.nav.button.hover.color');
    }

    .rs-galleria-nav-button:not(.rs-disabled):focus-visible {
        box-shadow: dt('galleria.nav.button.focus.ring.shadow');
        outline: dt('galleria.nav.button.focus.ring.width') dt('galleria.nav.button.focus.ring.style') dt('galleria.nav.button.focus.ring.color');
        outline-offset: dt('galleria.nav.button.focus.ring.offset');
    }

    .rs-galleria-next-icon,
    .rs-galleria-prev-icon {
        font-size: dt('galleria.nav.icon.size');
        width: dt('galleria.nav.icon.size');
        height: dt('galleria.nav.icon.size');
    }

    .rs-galleria-prev-button {
        border-radius: dt('galleria.nav.button.prev.border.radius');
        left: 0;
    }

    .rs-galleria-next-button {
        border-radius: dt('galleria.nav.button.next.border.radius');
        right: 0;
    }

    .rs-galleria-prev-button:dir(rtl) {
        left: auto;
        right: 0;
        transform: rotate(180deg);
    }

    .rs-galleria-next-button:dir(rtl) {
        right: auto;
        left: 0;
        transform: rotate(180deg);
    }

    .rs-galleria-item {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
    }

    .rs-galleria-hover-navigators .rs-galleria-nav-button {
        pointer-events: none;
        opacity: 0;
        transition: opacity dt('galleria.transition.duration') ease-in-out;
    }

    .rs-galleria-hover-navigators .rs-galleria-items-container:hover .rs-galleria-nav-button {
        pointer-events: all;
        opacity: 1;
    }

    .rs-galleria-hover-navigators .rs-galleria-items-container:hover .rs-galleria-nav-button.rs-disabled {
        pointer-events: none;
    }

    .rs-galleria-caption {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background: dt('galleria.caption.background');
        color: dt('galleria.caption.color');
        padding: dt('galleria.caption.padding');
    }

    .rs-galleria-thumbnails {
        display: flex;
        flex-direction: column;
        overflow: auto;
        flex-shrink: 0;
    }

    .rs-galleria-thumbnail-nav-button {
        align-self: center;
        flex: 0 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        position: relative;
        margin: 0 dt('galleria.thumbnail.nav.button.gutter');
        padding: 0;
        border: none;
        user-select: none;
        cursor: pointer;
        background: transparent;
        color: dt('galleria.thumbnail.nav.button.color');
        width: dt('galleria.thumbnail.nav.button.size');
        height: dt('galleria.thumbnail.nav.button.size');
        transition:
            background dt('galleria.transition.duration'),
            color dt('galleria.transition.duration'),
            outline-color dt('galleria.transition.duration');
        outline-color: transparent;
        border-radius: dt('galleria.thumbnail.nav.button.border.radius');
    }

    .rs-galleria-thumbnail-nav-button:hover {
        background: dt('galleria.thumbnail.nav.button.hover.background');
        color: dt('galleria.thumbnail.nav.button.hover.color');
    }

    .rs-galleria-thumbnail-nav-button:focus-visible {
        box-shadow: dt('galleria.thumbnail.nav.button.focus.ring.shadow');
        outline: dt('galleria.thumbnail.nav.button.focus.ring.width') dt('galleria.thumbnail.nav.button.focus.ring.style') dt('galleria.thumbnail.nav.button.focus.ring.color');
        outline-offset: dt('galleria.thumbnail.nav.button.focus.ring.offset');
    }

    .rs-galleria-thumbnail-nav-button .rs-galleria-thumbnail-next-icon,
    .rs-galleria-thumbnail-nav-button .rs-galleria-thumbnail-prev-icon {
        font-size: dt('galleria.thumbnail.nav.button.icon.size');
        width: dt('galleria.thumbnail.nav.button.icon.size');
        height: dt('galleria.thumbnail.nav.button.icon.size');
    }

    .rs-galleria-thumbnails-content {
        display: flex;
        flex-direction: row;
        background: dt('galleria.thumbnails.content.background');
        padding: dt('galleria.thumbnails.content.padding');
    }

    .rs-galleria-thumbnails-viewport {
        overflow: hidden;
        width: 100%;
    }

    .rs-galleria:not(.rs-galleria-thumbnails-right):not(.rs-galleria-thumbnails-left) .rs-galleria-thumbnail-prev-button:dir(rtl),
    .rs-galleria:not(.rs-galleria-thumbnails-right):not(.rs-galleria-thumbnails-left) .rs-galleria-thumbnail-next-button:dir(rtl) {
        transform: rotate(180deg);
    }

    .rs-galleria-thumbnail-items {
        display: flex;
    }

    .rs-galleria-thumbnail-items:dir(rtl) {
        flex-direction: row-reverse;
    }

    .rs-galleria-thumbnail-item {
        overflow: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0.5;
    }

    .rs-galleria-thumbnail {
        outline-color: transparent;
    }

    .rs-galleria-thumbnail-item:hover {
        opacity: 1;
        transition: opacity 0.3s;
    }

    .rs-galleria-thumbnail-item-current {
        opacity: 1;
    }

    .rs-galleria-thumbnails-left .rs-galleria-content,
    .rs-galleria-thumbnails-right .rs-galleria-content {
        flex-direction: row;
    }

    .rs-galleria-thumbnails-left .rs-galleria-items-container,
    .rs-galleria-thumbnails-right .rs-galleria-items-container {
        flex-direction: row;
    }

    .rs-galleria-thumbnails-left .rs-galleria-items-container,
    .rs-galleria-thumbnails-top .rs-galleria-items-container {
        order: 2;
    }

    .rs-galleria-thumbnails-left .rs-galleria-thumbnails,
    .rs-galleria-thumbnails-top .rs-galleria-thumbnails {
        order: 1;
    }

    .rs-galleria-thumbnails-left .rs-galleria-thumbnails-content,
    .rs-galleria-thumbnails-right .rs-galleria-thumbnails-content {
        flex-direction: column;
        flex-grow: 1;
    }

    .rs-galleria-thumbnails-left .rs-galleria-thumbnail-items,
    .rs-galleria-thumbnails-right .rs-galleria-thumbnail-items {
        flex-direction: column;
        height: 100%;
    }

    .rs-galleria-indicator-list {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: dt('galleria.indicator.list.padding');
        gap: dt('galleria.indicator.list.gap');
        margin: 0;
        list-style: none;
    }

    .rs-galleria-indicator-button {
        display: inline-flex;
        align-items: center;
        background: dt('galleria.indicator.button.background');
        width: dt('galleria.indicator.button.width');
        height: dt('galleria.indicator.button.height');
        transition:
            background dt('galleria.transition.duration'),
            color dt('galleria.transition.duration'),
            outline-color dt('galleria.transition.duration'),
            box-shadow dt('galleria.transition.duration');
        outline-color: transparent;
        border-radius: dt('galleria.indicator.button.border.radius');
        margin: 0;
        padding: 0;
        border: none;
        user-select: none;
        cursor: pointer;
    }

    .rs-galleria-indicator-button:hover {
        background: dt('galleria.indicator.button.hover.background');
    }

    .rs-galleria-indicator-button:focus-visible {
        box-shadow: dt('galleria.indicator.button.focus.ring.shadow');
        outline: dt('galleria.indicator.button.focus.ring.width') dt('galleria.indicator.button.focus.ring.style') dt('galleria.indicator.button.focus.ring.color');
        outline-offset: dt('galleria.indicator.button.focus.ring.offset');
    }

    .rs-galleria-indicator-active .rs-galleria-indicator-button {
        background: dt('galleria.indicator.button.active.background');
    }

    .rs-galleria-indicators-left .rs-galleria-items-container,
    .rs-galleria-indicators-right .rs-galleria-items-container {
        flex-direction: row;
        align-items: center;
    }

    .rs-galleria-indicators-left .rs-galleria-items,
    .rs-galleria-indicators-top .rs-galleria-items {
        order: 2;
    }

    .rs-galleria-indicators-left .rs-galleria-indicator-list,
    .rs-galleria-indicators-top .rs-galleria-indicator-list {
        order: 1;
    }

    .rs-galleria-indicators-left .rs-galleria-indicator-list,
    .rs-galleria-indicators-right .rs-galleria-indicator-list {
        flex-direction: column;
    }

    .rs-galleria-inset-indicators .rs-galleria-indicator-list {
        position: absolute;
        display: flex;
        z-index: 1;
        background: dt('galleria.inset.indicator.list.background');
    }

    .rs-galleria-inset-indicators .rs-galleria-indicator-button {
        background: dt('galleria.inset.indicator.button.background');
    }

    .rs-galleria-inset-indicators .rs-galleria-indicator-button:hover {
        background: dt('galleria.inset.indicator.button.hover.background');
    }

    .rs-galleria-inset-indicators .rs-galleria-indicator-active .rs-galleria-indicator-button {
        background: dt('galleria.inset.indicator.button.active.background');
    }

    .rs-galleria-inset-indicators.rs-galleria-indicators-top .rs-galleria-indicator-list {
        top: 0;
        left: 0;
        width: 100%;
        align-items: flex-start;
    }

    .rs-galleria-inset-indicators.rs-galleria-indicators-right .rs-galleria-indicator-list {
        right: 0;
        top: 0;
        height: 100%;
        align-items: flex-end;
    }

    .rs-galleria-inset-indicators.rs-galleria-indicators-bottom .rs-galleria-indicator-list {
        bottom: 0;
        left: 0;
        width: 100%;
        align-items: flex-end;
    }

    .rs-galleria-inset-indicators.rs-galleria-indicators-left .rs-galleria-indicator-list {
        left: 0;
        top: 0;
        height: 100%;
        align-items: flex-start;
    }

    .rs-galleria-mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .rs-galleria-close-button {
        position: absolute !important;
        top: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        margin: dt('galleria.close.button.gutter');
        background: dt('galleria.close.button.background');
        color: dt('galleria.close.button.color');
        width: dt('galleria.close.button.size');
        height: dt('galleria.close.button.size');
        padding: 0;
        border: none;
        user-select: none;
        cursor: pointer;
        border-radius: dt('galleria.close.button.border.radius');
        outline-color: transparent;
        transition:
            background dt('galleria.transition.duration'),
            color dt('galleria.transition.duration'),
            outline-color dt('galleria.transition.duration');
    }

    .rs-galleria-close-icon {
        font-size: dt('galleria.close.button.icon.size');
        width: dt('galleria.close.button.icon.size');
        height: dt('galleria.close.button.icon.size');
    }

    .rs-galleria-close-button:hover {
        background: dt('galleria.close.button.hover.background');
        color: dt('galleria.close.button.hover.color');
    }

    .rs-galleria-close-button:focus-visible {
        box-shadow: dt('galleria.close.button.focus.ring.shadow');
        outline: dt('galleria.close.button.focus.ring.width') dt('galleria.close.button.focus.ring.style') dt('galleria.close.button.focus.ring.color');
        outline-offset: dt('galleria.close.button.focus.ring.offset');
    }

    .rs-galleria-mask .rs-galleria-nav-button {
        position: fixed;
        top: 50%;
    }

       .rs-items-hidden .rs-galleria-thumbnail-item {
        visibility: hidden;
    }

    .rs-items-hidden .rs-galleria-thumbnail-item.rs-galleria-thumbnail-item-active {
        visibility: visible;
    }

    .rs-galleria-enter-active {
        animation: rs-animate-galleria-enter 300ms cubic-bezier(.19,1,.22,1);
    }

    .rs-galleria-leave-active {
        animation: rs-animate-galleria-leave 300ms cubic-bezier(.19,1,.22,1);
    }

    .rs-galleria-enter-active .rs-galleria-nav-button {
        opacity: 0;
    }

    @keyframes rs-animate-galleria-enter {
        from {
            opacity: 0;
            transform: scale(0.93);
        }
    }

    @keyframes rs-animate-galleria-leave {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.93);
        }
    }
`;
