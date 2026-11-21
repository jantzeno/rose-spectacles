import { style } from '../../internal/styles/tooltip/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: 'rs-tooltip rs-component',
    arrow: 'rs-tooltip-arrow',
    text: 'rs-tooltip-text'
};

export default BaseStyle.extend({
    name: 'tooltip-directive',
    style,
    classes
});
