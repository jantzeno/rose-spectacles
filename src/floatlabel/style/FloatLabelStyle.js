import { style } from '../../internal/styles/floatlabel/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ props }) => [
        'rs-floatlabel',
        {
            'rs-floatlabel-over': props.variant === 'over',
            'rs-floatlabel-on': props.variant === 'on',
            'rs-floatlabel-in': props.variant === 'in'
        }
    ]
};

export default BaseStyle.extend({
    name: 'floatlabel',
    style,
    classes
});
