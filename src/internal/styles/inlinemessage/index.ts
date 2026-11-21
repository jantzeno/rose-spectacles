export const style = /*css*/ `
    .rs-inlinemessage {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: dt('inlinemessage.padding');
        border-radius: dt('inlinemessage.border.radius');
        gap: dt('inlinemessage.gap');
    }

    .rs-inlinemessage-text {
        font-weight: dt('inlinemessage.text.font.weight');
    }

    .rs-inlinemessage-icon {
        flex-shrink: 0;
        font-size: dt('inlinemessage.icon.size');
        width: dt('inlinemessage.icon.size');
        height: dt('inlinemessage.icon.size');
    }

    .rs-inlinemessage-icon-only .rs-inlinemessage-text {
        visibility: hidden;
        width: 0;
    }

    .rs-inlinemessage-info {
        background: dt('inlinemessage.info.background');
        border: 1px solid dt('inlinemessage.info.border.color');
        color: dt('inlinemessage.info.color');
        box-shadow: dt('inlinemessage.info.shadow');
    }

    .rs-inlinemessage-info .rs-inlinemessage-icon {
        color: dt('inlinemessage.info.color');
    }

    .rs-inlinemessage-success {
        background: dt('inlinemessage.success.background');
        border: 1px solid dt('inlinemessage.success.border.color');
        color: dt('inlinemessage.success.color');
        box-shadow: dt('inlinemessage.success.shadow');
    }

    .rs-inlinemessage-success .rs-inlinemessage-icon {
        color: dt('inlinemessage.success.color');
    }

    .rs-inlinemessage-warn {
        background: dt('inlinemessage.warn.background');
        border: 1px solid dt('inlinemessage.warn.border.color');
        color: dt('inlinemessage.warn.color');
        box-shadow: dt('inlinemessage.warn.shadow');
    }

    .rs-inlinemessage-warn .rs-inlinemessage-icon {
        color: dt('inlinemessage.warn.color');
    }

    .rs-inlinemessage-error {
        background: dt('inlinemessage.error.background');
        border: 1px solid dt('inlinemessage.error.border.color');
        color: dt('inlinemessage.error.color');
        box-shadow: dt('inlinemessage.error.shadow');
    }

    .rs-inlinemessage-error .rs-inlinemessage-icon {
        color: dt('inlinemessage.error.color');
    }

    .rs-inlinemessage-secondary {
        background: dt('inlinemessage.secondary.background');
        border: 1px solid dt('inlinemessage.secondary.border.color');
        color: dt('inlinemessage.secondary.color');
        box-shadow: dt('inlinemessage.secondary.shadow');
    }

    .rs-inlinemessage-secondary .rs-inlinemessage-icon {
        color: dt('inlinemessage.secondary.color');
    }

    .rs-inlinemessage-contrast {
        background: dt('inlinemessage.contrast.background');
        border: 1px solid dt('inlinemessage.contrast.border.color');
        color: dt('inlinemessage.contrast.color');
        box-shadow: dt('inlinemessage.contrast.shadow');
    }

    .rs-inlinemessage-contrast .rs-inlinemessage-icon {
        color: dt('inlinemessage.contrast.color');
    }
`;
