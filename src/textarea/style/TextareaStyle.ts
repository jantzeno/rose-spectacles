import { style } from '../../internal/styles/textarea/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ instance, props }: StyleContext) => [
        'rs-textarea rs-component',
        {
            'rs-filled': instance.$filled,
            'rs-textarea-resizable ': props.autoResize,
            'rs-textarea-sm rs-inputfield-sm': props.size === 'small',
            'rs-textarea-lg rs-inputfield-lg': props.size === 'large',
            'rs-invalid': instance.$invalid,
            'rs-variant-filled': instance.$variant === 'filled',
            'rs-textarea-fluid': instance.$fluid
        }
    ]
};

export default BaseStyle.extend({
    name: 'textarea',
    style,
    classes
});
