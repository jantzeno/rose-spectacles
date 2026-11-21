import { style } from '../../internal/styles/splitter/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ props }: StyleContext) => ['rs-splitter rs-component', 'rs-splitter-' + props.layout],
    gutter: 'rs-splitter-gutter',
    gutterHandle: 'rs-splitter-gutter-handle'
};

export default BaseStyle.extend({
    name: 'splitter',
    style,
    classes
});
