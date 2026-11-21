import { style } from '../../internal/styles/badge/index';
import { isEmpty, isNotEmpty } from '../../internal/utils/object/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ props, instance }: StyleContext) => [
        'rs-badge rs-component',
        {
            'rs-badge-circle': isNotEmpty(props.value) && String(props.value).length === 1,
            'rs-badge-dot': isEmpty(props.value) && !instance.$slots.default,
            'rs-badge-sm': props.size === 'small',
            'rs-badge-lg': props.size === 'large',
            'rs-badge-xl': props.size === 'xlarge',
            'rs-badge-info': props.severity === 'info',
            'rs-badge-success': props.severity === 'success',
            'rs-badge-warn': props.severity === 'warn',
            'rs-badge-danger': props.severity === 'danger',
            'rs-badge-secondary': props.severity === 'secondary',
            'rs-badge-contrast': props.severity === 'contrast'
        }
    ]
};

export default BaseStyle.extend({
    name: 'badge',
    style,
    classes
});
