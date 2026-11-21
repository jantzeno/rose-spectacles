import { style } from '../../internal/styles/scrolltop/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ props }) => ['rs-scrolltop', { 'rs-scrolltop-sticky': props.target !== 'window' }],
    icon: 'rs-scrolltop-icon'
};

export default BaseStyle.extend({
    name: 'scrolltop',
    style,
    classes
});
