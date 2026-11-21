export const style = /*css*/ `
    .rs-badge {
        display: inline-flex;
        border-radius: dt('badge.border.radius');
        align-items: center;
        justify-content: center;
        padding: dt('badge.padding');
        background: dt('badge.primary.background');
        color: dt('badge.primary.color');
        font-size: dt('badge.font.size');
        font-weight: dt('badge.font.weight');
        min-width: dt('badge.min.width');
        height: dt('badge.height');
    }

    .rs-badge-dot {
        width: dt('badge.dot.size');
        min-width: dt('badge.dot.size');
        height: dt('badge.dot.size');
        border-radius: 50%;
        padding: 0;
    }

    .rs-badge-circle {
        padding: 0;
        border-radius: 50%;
    }

    .rs-badge-secondary {
        background: dt('badge.secondary.background');
        color: dt('badge.secondary.color');
    }

    .rs-badge-success {
        background: dt('badge.success.background');
        color: dt('badge.success.color');
    }

    .rs-badge-info {
        background: dt('badge.info.background');
        color: dt('badge.info.color');
    }

    .rs-badge-warn {
        background: dt('badge.warn.background');
        color: dt('badge.warn.color');
    }

    .rs-badge-danger {
        background: dt('badge.danger.background');
        color: dt('badge.danger.color');
    }

    .rs-badge-contrast {
        background: dt('badge.contrast.background');
        color: dt('badge.contrast.color');
    }

    .rs-badge-sm {
        font-size: dt('badge.sm.font.size');
        min-width: dt('badge.sm.min.width');
        height: dt('badge.sm.height');
    }

    .rs-badge-lg {
        font-size: dt('badge.lg.font.size');
        min-width: dt('badge.lg.min.width');
        height: dt('badge.lg.height');
    }

    .rs-badge-xl {
        font-size: dt('badge.xl.font.size');
        min-width: dt('badge.xl.min.width');
        height: dt('badge.xl.height');
    }
`;
