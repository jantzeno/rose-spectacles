import { style } from '../../internal/styles/toast/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

// Position
const inlineStyles = {
    root: ({ position }: StyleContext) => ({
        position: 'fixed',
        top: position === 'top-right' || position === 'top-left' || position === 'top-center' ? '20px' : position === 'center' ? '50%' : null,
        right: (position === 'top-right' || position === 'bottom-right') && '20px',
        bottom: (position === 'bottom-left' || position === 'bottom-right' || position === 'bottom-center') && '20px',
        left: position === 'top-left' || position === 'bottom-left' ? '20px' : position === 'center' || position === 'top-center' || position === 'bottom-center' ? '50%' : null
    })
};

const classes = {
    root: ({ props }: StyleContext) => ['rs-toast rs-component rs-toast-' + props.position],
    message: ({ props }: StyleContext) => [
        'rs-toast-message',
        {
            'rs-toast-message-info': props.message.severity === 'info' || props.message.severity === undefined,
            'rs-toast-message-warn': props.message.severity === 'warn',
            'rs-toast-message-error': props.message.severity === 'error',
            'rs-toast-message-success': props.message.severity === 'success',
            'rs-toast-message-secondary': props.message.severity === 'secondary',
            'rs-toast-message-contrast': props.message.severity === 'contrast'
        }
    ],
    messageContent: 'rs-toast-message-content',
    messageIcon: ({ props }: StyleContext) => [
        'rs-toast-message-icon',
        {
            [props.infoIcon]: props.message.severity === 'info',
            [props.warnIcon]: props.message.severity === 'warn',
            [props.errorIcon]: props.message.severity === 'error',
            [props.successIcon]: props.message.severity === 'success'
        }
    ],
    messageText: 'rs-toast-message-text',
    summary: 'rs-toast-summary',
    detail: 'rs-toast-detail',
    closeButton: 'rs-toast-close-button',
    closeIcon: 'rs-toast-close-icon'
};

export default BaseStyle.extend({
    name: 'toast',
    style,
    classes,
    inlineStyles
});
