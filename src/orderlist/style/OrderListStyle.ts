import { style } from '../../internal/styles/orderlist/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: 'rs-orderlist rs-component',
    controls: 'rs-orderlist-controls'
};

export default BaseStyle.extend({
    name: 'orderlist',
    style,
    classes
});
