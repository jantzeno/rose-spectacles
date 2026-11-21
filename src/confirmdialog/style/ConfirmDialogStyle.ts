import { style } from '../../internal/styles/confirmdialog/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: 'rs-confirmdialog',
    icon: 'rs-confirmdialog-icon',
    message: 'rs-confirmdialog-message',
    pcRejectButton: 'rs-confirmdialog-reject-button',
    pcAcceptButton: 'rs-confirmdialog-accept-button'
};

export default BaseStyle.extend({
    name: 'confirmdialog',
    style,
    classes
});
