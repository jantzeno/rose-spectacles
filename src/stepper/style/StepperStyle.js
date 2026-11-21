import { style } from '../../internal/styles/stepper/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ props }) => [
        'rs-stepper rs-component',
        {
            'rs-readonly': props.linear
        }
    ],
    separator: 'rs-stepper-separator'
};

export default BaseStyle.extend({
    name: 'stepper',
    style,
    classes
});
