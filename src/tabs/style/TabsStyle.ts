import { style } from '../../internal/styles/tabs/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ props }: StyleContext) => [
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
