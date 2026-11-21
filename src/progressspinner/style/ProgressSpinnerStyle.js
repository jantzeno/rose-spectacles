import { style } from '../../internal/styles/progressspinner/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: 'rs-progressspinner',
    spin: 'rs-progressspinner-spin',
    circle: 'rs-progressspinner-circle'
};

export default BaseStyle.extend({
    name: 'progressspinner',
    style,
    classes
});
