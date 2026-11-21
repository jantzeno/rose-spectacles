import { style } from '../../internal/styles/ripple/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: 'rs-ink'
};

export default BaseStyle.extend({
    name: 'ripple-directive',
    style,
    classes
});
