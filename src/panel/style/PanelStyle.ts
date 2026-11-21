import { style } from '../../internal/styles/panel/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ props }: StyleContext) => [
        'rs-panel rs-component',
        {
            'rs-panel-toggleable': props.toggleable
        }
    ],
    header: 'rs-panel-header',
    title: 'rs-panel-title',
    headerActions: 'rs-panel-header-actions',
    pcToggleButton: 'rs-panel-toggle-button',
    contentContainer: 'rs-panel-content-container',
    contentWrapper: 'rs-panel-content-wrapper',
    content: 'rs-panel-content',
    footer: 'rs-panel-footer'
};

export default BaseStyle.extend({
    name: 'panel',
    style,
    classes
});
