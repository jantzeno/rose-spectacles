import { style } from '../../internal/styles/inplace/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: 'rs-inplace rs-component',
    display: ({ props }) => ['rs-inplace-display', { 'rs-disabled': props.disabled }],
    content: 'rs-inplace-content'
};

export default BaseStyle.extend({
    name: 'inplace',
    style,
    classes
});
