import { style } from '../../internal/styles/togglebutton/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ instance, props }: StyleContext) => [
        'rs-togglebutton rs-component',
        {
            'rs-togglebutton-checked': instance.active,
            'rs-invalid': instance.$invalid,
            'rs-togglebutton-fluid': props.fluid,
            'rs-togglebutton-sm rs-inputfield-sm': props.size === 'small',
            'rs-togglebutton-lg rs-inputfield-lg': props.size === 'large'
        }
    ],
    content: 'rs-togglebutton-content',
    icon: 'rs-togglebutton-icon',
    label: 'rs-togglebutton-label'
};

export default BaseStyle.extend({
    name: 'togglebutton',
    style,
    classes
});
