import { style } from '../../internal/styles/imagecompare/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: 'rs-imagecompare',
    slider: 'rs-imagecompare-slider'
};

export default BaseStyle.extend({
    name: 'imagecompare',
    style,
    classes
});
