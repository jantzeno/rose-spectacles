import { style } from '../../internal/styles/inputtext/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ instance, props }: StyleContext) => [
        'rs-inputtext rs-component',
        {
            'rs-filled': instance.$filled,
            'rs-inputtext-sm rs-inputfield-sm': props.size === 'small',
            'rs-inputtext-lg rs-inputfield-lg': props.size === 'large',
            'rs-invalid': instance.$invalid,
            'rs-variant-filled': instance.$variant === 'filled',
            'rs-inputtext-fluid': instance.$fluid
        }
    ]
};

export default BaseStyle.extend({
    name: 'inputtext',
    style,
    classes
});
