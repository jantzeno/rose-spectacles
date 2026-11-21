import { style } from '../../internal/styles/button/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ instance, props }) => [
        'rs-button rs-component',
        {
            'rs-button-icon-only': instance.hasIcon && !props.label && !props.badge,
            'rs-button-vertical': (props.iconPos === 'top' || props.iconPos === 'bottom') && props.label,
            'rs-button-loading': props.loading,
            'rs-button-link': props.link || props.variant === 'link',
            [`rs-button-${props.severity}`]: props.severity,
            'rs-button-raised': props.raised,
            'rs-button-rounded': props.rounded,
            'rs-button-text': props.text || props.variant === 'text',
            'rs-button-outlined': props.outlined || props.variant === 'outlined',
            'rs-button-sm': props.size === 'small',
            'rs-button-lg': props.size === 'large',
            'rs-button-plain': props.plain,
            'rs-button-fluid': instance.hasFluid
        }
    ],
    loadingIcon: 'rs-button-loading-icon',
    icon: ({ props }) => [
        'rs-button-icon',
        {
            [`rs-button-icon-${props.iconPos}`]: props.label
        }
    ],
    label: 'rs-button-label'
};

export default BaseStyle.extend({
    name: 'button',
    style,
    classes
});
