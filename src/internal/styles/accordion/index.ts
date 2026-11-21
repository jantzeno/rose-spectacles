export const style = /*css*/ `
    .rs-accordionpanel {
        display: flex;
        flex-direction: column;
        border-style: solid;
        border-width: dt('accordion.panel.border.width');
        border-color: dt('accordion.panel.border.color');
    }

    .rs-accordionheader {
        all: unset;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: dt('accordion.header.padding');
        color: dt('accordion.header.color');
        background: dt('accordion.header.background');
        border-style: solid;
        border-width: dt('accordion.header.border.width');
        border-color: dt('accordion.header.border.color');
        font-weight: dt('accordion.header.font.weight');
        border-radius: dt('accordion.header.border.radius');
        transition:
            background dt('accordion.transition.duration'),
            color dt('accordion.transition.duration'),
            outline-color dt('accordion.transition.duration'),
            box-shadow dt('accordion.transition.duration');
        outline-color: transparent;
    }

    .rs-accordionpanel:first-child > .rs-accordionheader {
        border-width: dt('accordion.header.first.border.width');
        border-start-start-radius: dt('accordion.header.first.top.border.radius');
        border-start-end-radius: dt('accordion.header.first.top.border.radius');
    }

    .rs-accordionpanel:last-child > .rs-accordionheader {
        border-end-start-radius: dt('accordion.header.last.bottom.border.radius');
        border-end-end-radius: dt('accordion.header.last.bottom.border.radius');
    }

    .rs-accordionpanel:last-child.rs-accordionpanel-active > .rs-accordionheader {
        border-end-start-radius: dt('accordion.header.last.active.bottom.border.radius');
        border-end-end-radius: dt('accordion.header.last.active.bottom.border.radius');
    }

    .rs-accordionheader-toggle-icon {
        color: dt('accordion.header.toggle.icon.color');
    }

    .rs-accordionpanel:not(.rs-disabled) .rs-accordionheader:focus-visible {
        box-shadow: dt('accordion.header.focus.ring.shadow');
        outline: dt('accordion.header.focus.ring.width') dt('accordion.header.focus.ring.style') dt('accordion.header.focus.ring.color');
        outline-offset: dt('accordion.header.focus.ring.offset');
    }

    .rs-accordionpanel:not(.rs-accordionpanel-active):not(.rs-disabled) > .rs-accordionheader:hover {
        background: dt('accordion.header.hover.background');
        color: dt('accordion.header.hover.color');
    }

    .rs-accordionpanel:not(.rs-accordionpanel-active):not(.rs-disabled) .rs-accordionheader:hover .rs-accordionheader-toggle-icon {
        color: dt('accordion.header.toggle.icon.hover.color');
    }

    .rs-accordionpanel:not(.rs-disabled).rs-accordionpanel-active > .rs-accordionheader {
        background: dt('accordion.header.active.background');
        color: dt('accordion.header.active.color');
    }

    .rs-accordionpanel:not(.rs-disabled).rs-accordionpanel-active > .rs-accordionheader .rs-accordionheader-toggle-icon {
        color: dt('accordion.header.toggle.icon.active.color');
    }

    .rs-accordionpanel:not(.rs-disabled).rs-accordionpanel-active > .rs-accordionheader:hover {
        background: dt('accordion.header.active.hover.background');
        color: dt('accordion.header.active.hover.color');
    }

    .rs-accordionpanel:not(.rs-disabled).rs-accordionpanel-active > .rs-accordionheader:hover .rs-accordionheader-toggle-icon {
        color: dt('accordion.header.toggle.icon.active.hover.color');
    }

    .rs-accordioncontent {
        display: grid;
        grid-template-rows: 1fr;
    }

    .rs-accordioncontent-wrapper {
        min-height: 0;
    }

    .rs-accordioncontent-content {
        border-style: solid;
        border-width: dt('accordion.content.border.width');
        border-color: dt('accordion.content.border.color');
        background-color: dt('accordion.content.background');
        color: dt('accordion.content.color');
        padding: dt('accordion.content.padding');
    }
`;
