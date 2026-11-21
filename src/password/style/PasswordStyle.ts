import { style } from '../../internal/styles/password/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const buttonReset = {
    border: 'none',
    background: 'transparent',
    padding: 0,
    cursor: 'pointer',
    font: 'inherit'
};

const inlineStyles = {
    root: ({ props }: StyleContext) => ({ position: props.appendTo === 'self' ? 'relative' : undefined }),
    maskIcon: buttonReset,
    unmaskIcon: buttonReset,
    clearIcon: buttonReset
};

const iconButtonStyle = `
    .rs-password-toggle-mask-icon:focus-visible,
    .rs-password-clear-icon:focus-visible {
        outline: var(--rs-focus-ring-width) var(--rs-focus-ring-style) var(--rs-focus-ring-color);
        outline-offset: var(--rs-focus-ring-offset);
    }

    .rs-password-toggle-mask-icon,
    .rs-password-clear-icon {
        border-radius: max(2px, dt('form.field.border.radius') - dt('form.field.padding.x'));
    }
`;

const classes = {
    root: ({ instance }: StyleContext) => [
        'rs-password rs-component rs-inputwrapper',
        {
            'rs-inputwrapper-filled': instance.$filled,
            'rs-inputwrapper-focus': instance.focused,
            'rs-password-fluid': instance.$fluid
        }
    ],
    pcInputText: 'rs-password-input',
    maskIcon: 'rs-password-toggle-mask-icon rs-password-mask-icon',
    unmaskIcon: 'rs-password-toggle-mask-icon rs-password-unmask-icon',
    clearIcon: 'rs-password-clear-icon',
    overlay: 'rs-password-overlay rs-component',
    content: 'rs-password-content',
    meter: 'rs-password-meter',
    meterLabel: ({ instance }: StyleContext) => `rs-password-meter-label ${instance.meter ? 'rs-password-meter-' + instance.meter.strength : ''}`,
    meterText: 'rs-password-meter-text'
};

export default BaseStyle.extend({
    name: 'password',
    style: style + iconButtonStyle,
    classes,
    inlineStyles
});
