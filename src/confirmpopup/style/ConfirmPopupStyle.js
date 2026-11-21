import { style } from '../../internal/styles/confirmpopup/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: 'rs-confirmpopup rs-component',
    content: 'rs-confirmpopup-content',
    icon: 'rs-confirmpopup-icon',
    message: 'rs-confirmpopup-message',
    footer: 'rs-confirmpopup-footer',
    pcRejectButton: 'rs-confirmpopup-reject-button',
    pcAcceptButton: 'rs-confirmpopup-accept-button'
};

export default BaseStyle.extend({
    name: 'confirmpopup',
    style,
    classes
});
