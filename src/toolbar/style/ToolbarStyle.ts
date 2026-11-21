import { style } from '../../internal/styles/toolbar/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: 'rs-toolbar rs-component',
    start: 'rs-toolbar-start',
    center: 'rs-toolbar-center',
    end: 'rs-toolbar-end'
};

export default BaseStyle.extend({
    name: 'toolbar',
    style,
    classes
});
