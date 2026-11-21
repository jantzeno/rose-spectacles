export const style = /*css*/ `
    .rs-panel {
        display: block;
        border: 1px solid dt('panel.border.color');
        border-radius: dt('panel.border.radius');
        background: dt('panel.background');
        color: dt('panel.color');
    }

    .rs-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: dt('panel.header.padding');
        background: dt('panel.header.background');
        color: dt('panel.header.color');
        border-style: solid;
        border-width: dt('panel.header.border.width');
        border-color: dt('panel.header.border.color');
        border-radius: dt('panel.header.border.radius');
    }

    .rs-panel-toggleable .rs-panel-header {
        padding: dt('panel.toggleable.header.padding');
    }

    .rs-panel-title {
        line-height: 1;
        font-weight: dt('panel.title.font.weight');
    }

    .rs-panel-content-container {
        display: grid;
        grid-template-rows: 1fr;
    }

    .rs-panel-content-wrapper {
        min-height: 0;
    }

    .rs-panel-content {
        padding: dt('panel.content.padding');
    }

    .rs-panel-footer {
        padding: dt('panel.footer.padding');
    }
`;
