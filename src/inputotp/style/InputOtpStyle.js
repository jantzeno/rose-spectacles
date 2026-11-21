import { style } from '../../internal/styles/inputotp/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: 'rs-inputotp rs-component',
    pcInputText: 'rs-inputotp-input'
};

export default BaseStyle.extend({
    name: 'inputotp',
    style,
    classes
});
