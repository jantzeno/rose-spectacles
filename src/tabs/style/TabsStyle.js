import { style } from '../../internal/styles/tabs/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ props }) => [
        'rs-tabs rs-component',
        {
            'rs-tabs-scrollable': props.scrollable
        }
    ]
};

export default BaseStyle.extend({
    name: 'tabs',
    style,
    classes
});
