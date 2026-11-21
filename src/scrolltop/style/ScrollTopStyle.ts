import { style } from '../../internal/styles/scrolltop/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ props }: StyleContext) => ['rs-scrolltop', { 'rs-scrolltop-sticky': props.target !== 'window' }],
    icon: 'rs-scrolltop-icon'
};

export default BaseStyle.extend({
    name: 'scrolltop',
    style,
    classes
});
