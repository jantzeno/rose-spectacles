import { style } from '../../internal/styles/selectbutton/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ props, instance }: StyleContext) => [
        'rs-selectbutton rs-component',
        {
            'rs-invalid': instance.$invalid, // @todo: check
            'rs-selectbutton-fluid': props.fluid
        }
    ]
};

export default BaseStyle.extend({
    name: 'selectbutton',
    style,
    classes
});
