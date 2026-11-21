export const style = /*css*/ `
    .rs-carousel {
        display: flex;
        flex-direction: column;
    }

    .rs-carousel-content-container {
        display: flex;
        flex-direction: column;
        overflow: auto;
    }

    .rs-carousel-content {
        display: flex;
        flex-direction: row;
        gap: dt('carousel.content.gap');
    }

    .rs-carousel-content:dir(rtl) {
        flex-direction: row-reverse;
    }

    .rs-carousel-viewport {
        overflow: hidden;
        width: 100%;
    }

    .rs-carousel-item-list {
        display: flex;
        flex-direction: row;
    }

    .rs-carousel-item-list:dir(rtl) {
        flex-direction: row-reverse;
    }

    .rs-carousel-prev-button,
    .rs-carousel-next-button {
        align-self: center;
        flex-shrink: 0;
    }

    .rs-carousel-indicator-list {
        display: flex;
        flex-direction: row;
        justify-content: center;
        flex-wrap: wrap;
        padding: dt('carousel.indicator.list.padding');
        gap: dt('carousel.indicator.list.gap');
        margin: 0;
        list-style: none;
    }

    .rs-carousel-indicator-button {
        display: flex;
        align-items: center;
        justify-content: center;
        background: dt('carousel.indicator.background');
        width: dt('carousel.indicator.width');
        height: dt('carousel.indicator.height');
        border: 0 none;
        transition:
            background dt('carousel.transition.duration'),
            color dt('carousel.transition.duration'),
            outline-color dt('carousel.transition.duration'),
            box-shadow dt('carousel.transition.duration');
        outline-color: transparent;
        border-radius: dt('carousel.indicator.border.radius');
        padding: 0;
        margin: 0;
        user-select: none;
        cursor: pointer;
    }

    .rs-carousel-indicator-button:focus-visible {
        box-shadow: dt('carousel.indicator.focus.ring.shadow');
        outline: dt('carousel.indicator.focus.ring.width') dt('carousel.indicator.focus.ring.style') dt('carousel.indicator.focus.ring.color');
        outline-offset: dt('carousel.indicator.focus.ring.offset');
    }

    .rs-carousel-indicator-button:hover {
        background: dt('carousel.indicator.hover.background');
    }

    .rs-carousel-indicator-active .rs-carousel-indicator-button {
        background: dt('carousel.indicator.active.background');
    }

    .rs-carousel-vertical .rs-carousel-content {
        flex-direction: column;
    }

    .rs-carousel-vertical .rs-carousel-item-list {
        flex-direction: column;
        height: 100%;
    }

    .rs-items-hidden .rs-carousel-item {
        visibility: hidden;
    }

    .rs-items-hidden .rs-carousel-item.rs-carousel-item-active {
        visibility: visible;
    }
`;
