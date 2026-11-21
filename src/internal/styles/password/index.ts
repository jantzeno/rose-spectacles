export const style = /*css*/ `
    .rs-password {
        display: inline-flex;
        position: relative;
    }

    .rs-password .rs-password-overlay {
        min-width: 100%;
    }

    .rs-password-meter {
        height: dt('password.meter.height');
        background: dt('password.meter.background');
        border-radius: dt('password.meter.border.radius');
    }

    .rs-password-meter-label {
        height: 100%;
        width: 0;
        transition: width 1s ease-in-out;
        border-radius: dt('password.meter.border.radius');
    }

    .rs-password-meter-weak {
        background: dt('password.strength.weak.background');
    }

    .rs-password-meter-medium {
        background: dt('password.strength.medium.background');
    }

    .rs-password-meter-strong {
        background: dt('password.strength.strong.background');
    }

    .rs-password-fluid {
        display: flex;
    }

    .rs-password-fluid .rs-password-input {
        width: 100%;
    }

    .rs-password-input::-ms-reveal,
    .rs-password-input::-ms-clear {
        display: none;
    }

    .rs-password-overlay {
        padding: dt('password.overlay.padding');
        background: dt('password.overlay.background');
        color: dt('password.overlay.color');
        border: 1px solid dt('password.overlay.border.color');
        box-shadow: dt('password.overlay.shadow');
        border-radius: dt('password.overlay.border.radius');
    }

    .rs-password-content {
        display: flex;
        flex-direction: column;
        gap: dt('password.content.gap');
    }

    .rs-password-toggle-mask-icon {
        inset-inline-end: dt('form.field.padding.x');
        color: dt('password.icon.color');
        position: absolute;
        top: 50%;
        margin-top: calc(-1 * calc(dt('icon.size') / 2));
        width: dt('icon.size');
        height: dt('icon.size');
    }

    .rs-password-clear-icon {
        position: absolute;
        top: 50%;
        margin-top: -0.5rem;
        cursor: pointer;
        inset-inline-end: dt('form.field.padding.x');
        color: dt('form.field.icon.color');
    }

    .rs-password:has(.rs-password-toggle-mask-icon) .rs-password-input {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .rs-password:has(.rs-password-toggle-mask-icon) .rs-password-clear-icon {
        inset-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .rs-password:has(.rs-password-clear-icon) .rs-password-input {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .rs-password:has(.rs-password-clear-icon):has(.rs-password-toggle-mask-icon)  .rs-password-input {
        padding-inline-end: calc((dt('form.field.padding.x') * 3) + calc(dt('icon.size') * 2));
    }

`;
