import { style } from '../../internal/styles/popover/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: 'rs-popover rs-component',
    content: 'rs-popover-content'
};

export default BaseStyle.extend({
    name: 'popover',
    style,
    classes
});
