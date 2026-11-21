import { style } from '../../internal/styles/selectbutton/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ props, instance }) => [
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
