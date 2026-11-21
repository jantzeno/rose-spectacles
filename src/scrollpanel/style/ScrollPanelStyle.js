import { style } from '../../internal/styles/scrollpanel/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: 'rs-scrollpanel rs-component',
    contentContainer: 'rs-scrollpanel-content-container',
    content: 'rs-scrollpanel-content',
    barX: 'rs-scrollpanel-bar rs-scrollpanel-bar-x',
    barY: 'rs-scrollpanel-bar rs-scrollpanel-bar-y'
};

export default BaseStyle.extend({
    name: 'scrollpanel',
    style,
    classes
});
