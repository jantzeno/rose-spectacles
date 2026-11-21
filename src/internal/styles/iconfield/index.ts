export const style = /*css*/ `
    .rs-iconfield {
        position: relative;
        display: block;
    }

    .rs-inputicon {
        position: absolute;
        top: 50%;
        margin-top: calc(-1 * (dt('icon.size') / 2));
        color: dt('iconfield.icon.color');
        line-height: 1;
        z-index: 1;
    }

    .rs-iconfield .rs-inputicon:first-child {
        inset-inline-start: dt('form.field.padding.x');
    }

    .rs-iconfield .rs-inputicon:last-child {
        inset-inline-end: dt('form.field.padding.x');
    }

    .rs-iconfield .rs-inputtext:not(:first-child),
    .rs-iconfield .rs-inputwrapper:not(:first-child) .rs-inputtext {
        padding-inline-start: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .rs-iconfield .rs-inputtext:not(:last-child) {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .rs-iconfield:has(.rs-inputfield-sm) .rs-inputicon {
        font-size: dt('form.field.sm.font.size');
        width: dt('form.field.sm.font.size');
        height: dt('form.field.sm.font.size');
        margin-top: calc(-1 * (dt('form.field.sm.font.size') / 2));
    }

    .rs-iconfield:has(.rs-inputfield-lg) .rs-inputicon {
        font-size: dt('form.field.lg.font.size');
        width: dt('form.field.lg.font.size');
        height: dt('form.field.lg.font.size');
        margin-top: calc(-1 * (dt('form.field.lg.font.size') / 2));
    }
`;
