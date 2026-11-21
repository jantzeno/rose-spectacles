export const style = /*css*/ `
    .rs-metergroup {
        display: flex;
        gap: dt('metergroup.gap');
    }

    .rs-metergroup-meters {
        display: flex;
        background: dt('metergroup.meters.background');
        border-radius: dt('metergroup.border.radius');
    }

    .rs-metergroup-label-list {
        display: flex;
        flex-wrap: wrap;
        margin: 0;
        padding: 0;
        list-style-type: none;
    }

    .rs-metergroup-label {
        display: inline-flex;
        align-items: center;
        gap: dt('metergroup.label.gap');
    }

    .rs-metergroup-label-marker {
        display: inline-flex;
        width: dt('metergroup.label.marker.size');
        height: dt('metergroup.label.marker.size');
        border-radius: 100%;
    }

    .rs-metergroup-label-icon {
        font-size: dt('metergroup.label.icon.size');
        width: dt('metergroup.label.icon.size');
        height: dt('metergroup.label.icon.size');
    }

    .rs-metergroup-horizontal {
        flex-direction: column;
    }

    .rs-metergroup-label-list-horizontal {
        gap: dt('metergroup.label.list.horizontal.gap');
    }

    .rs-metergroup-horizontal .rs-metergroup-meters {
        height: dt('metergroup.meters.size');
    }

    .rs-metergroup-horizontal .rs-metergroup-meter:first-of-type {
        border-start-start-radius: dt('metergroup.border.radius');
        border-end-start-radius: dt('metergroup.border.radius');
    }

    .rs-metergroup-horizontal .rs-metergroup-meter:last-of-type {
        border-start-end-radius: dt('metergroup.border.radius');
        border-end-end-radius: dt('metergroup.border.radius');
    }

    .rs-metergroup-vertical {
        flex-direction: row;
    }

    .rs-metergroup-label-list-vertical {
        flex-direction: column;
        gap: dt('metergroup.label.list.vertical.gap');
    }

    .rs-metergroup-vertical .rs-metergroup-meters {
        flex-direction: column;
        width: dt('metergroup.meters.size');
        height: 100%;
    }

    .rs-metergroup-vertical .rs-metergroup-label-list {
        align-items: flex-start;
    }

    .rs-metergroup-vertical .rs-metergroup-meter:first-of-type {
        border-start-start-radius: dt('metergroup.border.radius');
        border-start-end-radius: dt('metergroup.border.radius');
    }

    .rs-metergroup-vertical .rs-metergroup-meter:last-of-type {
        border-end-start-radius: dt('metergroup.border.radius');
        border-end-end-radius: dt('metergroup.border.radius');
    }
`;
