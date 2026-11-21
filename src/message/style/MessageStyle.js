import { style } from '../../internal/styles/message/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ props }) => [
        'rs-message rs-component rs-message-' + props.severity,
        {
            'rs-message-outlined': props.variant === 'outlined',
            'rs-message-simple': props.variant === 'simple',
            'rs-message-sm': props.size === 'small',
            'rs-message-lg': props.size === 'large'
        }
    ],
    contentWrapper: 'rs-message-content-wrapper',
    content: 'rs-message-content',
    icon: 'rs-message-icon',
    text: 'rs-message-text',
    closeButton: 'rs-message-close-button',
    closeIcon: 'rs-message-close-icon'
};

export default BaseStyle.extend({
    name: 'message',
    style,
    classes
});
