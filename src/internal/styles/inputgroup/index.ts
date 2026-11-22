export const style = /*css*/ `
    .rs-inputgroup,
    .rs-inputgroup .rs-iconfield,
    .rs-inputgroup .rs-floatlabel,
    .rs-inputgroup .rs-iftalabel {
        display: flex;
        align-items: stretch;
        width: 100%;
    }

    .rs-inputgroup .rs-floatlabel .rs-inputwrapper,
    .rs-inputgroup .rs-iftalabel .rs-inputwrapper {
        display: inline-flex;
    }

    .rs-inputgroup .rs-inputtext,
    .rs-inputgroup .rs-inputwrapper {
        flex: 1 1 auto;
        width: 1%;
    }

    .rs-inputgroupaddon {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: dt('inputgroup.addon.padding');
        background: dt('inputgroup.addon.background');
        color: dt('inputgroup.addon.color');
        border-block-start: 1px solid dt('inputgroup.addon.border.color');
        border-block-end: 1px solid dt('inputgroup.addon.border.color');
        min-width: dt('inputgroup.addon.min.width');
    }

    .rs-inputgroupaddon:first-child,
    .rs-inputgroupaddon + .rs-inputgroupaddon {
        border-inline-start: 1px solid dt('inputgroup.addon.border.color');
    }

    .rs-inputgroupaddon:last-child {
        border-inline-end: 1px solid dt('inputgroup.addon.border.color');
    }

    .rs-inputgroup:has(> .rs-inputtext-sm, > :is(.rs-iconfield, .rs-floatlabel, .rs-iftalabel) > .rs-inputtext-sm) > .rs-inputgroupaddon:not(:has(.rs-button)) {
        font-size: dt('inputtext.sm.font.size');
        padding-block: dt('inputtext.sm.padding.y');
        padding-inline: dt('inputtext.sm.padding.x');
    }

    .rs-inputgroupaddon:has(.rs-button) {
        padding: 0;
        overflow: hidden;
    }

    .rs-inputgroupaddon .rs-button {
        border-radius: 0;
    }

    .rs-inputgroup > .rs-component,
    .rs-inputgroup > .rs-inputwrapper > .rs-component,
    .rs-inputgroup > .rs-iconfield > .rs-component,
    .rs-inputgroup > .rs-floatlabel > .rs-component,
    .rs-inputgroup > .rs-floatlabel > .rs-inputwrapper > .rs-component,
    .rs-inputgroup > .rs-iftalabel > .rs-component,
    .rs-inputgroup > .rs-iftalabel > .rs-inputwrapper > .rs-component {
        border-radius: 0;
        margin: 0;
    }

    .rs-inputgroupaddon:first-child,
    .rs-inputgroup > .rs-component:first-child,
    .rs-inputgroup > .rs-inputwrapper:first-child > .rs-component,
    .rs-inputgroup > .rs-iconfield:first-child > .rs-component,
    .rs-inputgroup > .rs-floatlabel:first-child > .rs-component,
    .rs-inputgroup > .rs-floatlabel:first-child > .rs-inputwrapper > .rs-component,
    .rs-inputgroup > .rs-iftalabel:first-child > .rs-component,
    .rs-inputgroup > .rs-iftalabel:first-child > .rs-inputwrapper > .rs-component {
        border-start-start-radius: dt('inputgroup.addon.border.radius');
        border-end-start-radius: dt('inputgroup.addon.border.radius');
    }

    .rs-inputgroupaddon:last-child,
    .rs-inputgroup > .rs-component:last-child,
    .rs-inputgroup > .rs-inputwrapper:last-child > .rs-component,
    .rs-inputgroup > .rs-iconfield:last-child > .rs-component,
    .rs-inputgroup > .rs-floatlabel:last-child > .rs-component,
    .rs-inputgroup > .rs-floatlabel:last-child > .rs-inputwrapper > .rs-component,
    .rs-inputgroup > .rs-iftalabel:last-child > .rs-component,
    .rs-inputgroup > .rs-iftalabel:last-child > .rs-inputwrapper > .rs-component {
        border-start-end-radius: dt('inputgroup.addon.border.radius');
        border-end-end-radius: dt('inputgroup.addon.border.radius');
    }

    .rs-inputgroup .rs-component:focus,
    .rs-inputgroup .rs-component.rs-focus,
    .rs-inputgroup .rs-inputwrapper-focus,
    .rs-inputgroup .rs-component:focus ~ label,
    .rs-inputgroup .rs-component.rs-focus ~ label,
    .rs-inputgroup .rs-inputwrapper-focus ~ label,
    .rs-inputgroup .rs-floatlabel .rs-inputwrapper ~ label,
    .rs-inputgroup .rs-iftalabel .rs-inputwrapper ~ label {
        z-index: 1;
    }

    .rs-inputgroup > .rs-button:not(.rs-button-icon-only) {
        width: auto;
    }

    .rs-inputgroup .rs-iconfield + .rs-iconfield .rs-inputtext {
        border-inline-start: 0;
    }
`;
