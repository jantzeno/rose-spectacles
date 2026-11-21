import { style } from '../../internal/styles/inplace/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: 'rs-inplace rs-component',
    display: ({ props }: StyleContext) => ['rs-inplace-display', { 'rs-disabled': props.disabled }],
    content: 'rs-inplace-content'
};

export default BaseStyle.extend({
    name: 'inplace',
    style,
    classes
});
