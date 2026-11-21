export const style = /*css*/ `
    .rs-paginator {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        background: dt('paginator.background');
        color: dt('paginator.color');
        padding: dt('paginator.padding');
        border-radius: dt('paginator.border.radius');
        gap: dt('paginator.gap');
    }

    .rs-paginator-content {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: dt('paginator.gap');
    }

    .rs-paginator-content-start {
        margin-inline-end: auto;
    }

    .rs-paginator-content-end {
        margin-inline-start: auto;
    }

    .rs-paginator-page,
    .rs-paginator-next,
    .rs-paginator-last,
    .rs-paginator-first,
    .rs-paginator-prev {
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        user-select: none;
        overflow: hidden;
        position: relative;
        background: dt('paginator.nav.button.background');
        border: 0 none;
        color: dt('paginator.nav.button.color');
        min-width: dt('paginator.nav.button.width');
        height: dt('paginator.nav.button.height');
        transition:
            background dt('paginator.transition.duration'),
            color dt('paginator.transition.duration'),
            outline-color dt('paginator.transition.duration'),
            box-shadow dt('paginator.transition.duration');
        border-radius: dt('paginator.nav.button.border.radius');
        padding: 0;
        margin: 0;
    }

    .rs-paginator-page:focus-visible,
    .rs-paginator-next:focus-visible,
    .rs-paginator-last:focus-visible,
    .rs-paginator-first:focus-visible,
    .rs-paginator-prev:focus-visible {
        box-shadow: dt('paginator.nav.button.focus.ring.shadow');
        outline: dt('paginator.nav.button.focus.ring.width') dt('paginator.nav.button.focus.ring.style') dt('paginator.nav.button.focus.ring.color');
        outline-offset: dt('paginator.nav.button.focus.ring.offset');
    }

    .rs-paginator-page:not(.rs-disabled):not(.rs-paginator-page-selected):hover,
    .rs-paginator-first:not(.rs-disabled):hover,
    .rs-paginator-prev:not(.rs-disabled):hover,
    .rs-paginator-next:not(.rs-disabled):hover,
    .rs-paginator-last:not(.rs-disabled):hover {
        background: dt('paginator.nav.button.hover.background');
        color: dt('paginator.nav.button.hover.color');
    }

    .rs-paginator-page.rs-paginator-page-selected {
        background: dt('paginator.nav.button.selected.background');
        color: dt('paginator.nav.button.selected.color');
    }

    .rs-paginator-current {
        color: dt('paginator.current.page.report.color');
    }

    .rs-paginator-pages {
        display: flex;
        align-items: center;
        gap: dt('paginator.gap');
    }

    .rs-paginator-jtp-input .rs-inputtext {
        max-width: dt('paginator.jump.to.page.input.max.width');
    }

    .rs-paginator-first:dir(rtl),
    .rs-paginator-prev:dir(rtl),
    .rs-paginator-next:dir(rtl),
    .rs-paginator-last:dir(rtl) {
        transform: rotate(180deg);
    }
`;
