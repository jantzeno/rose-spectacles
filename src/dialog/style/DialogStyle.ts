import { style } from '../../internal/styles/dialog/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

/* Position */
const inlineStyles = {
    mask: ({ position, modal }: StyleContext) => ({
        position: 'fixed',
        height: '100%',
        width: '100%',
        left: 0,
        top: 0,
        display: 'flex',
        justifyContent: position === 'left' || position === 'topleft' || position === 'bottomleft' ? 'flex-start' : position === 'right' || position === 'topright' || position === 'bottomright' ? 'flex-end' : 'center',
        alignItems: position === 'top' || position === 'topleft' || position === 'topright' ? 'flex-start' : position === 'bottom' || position === 'bottomleft' || position === 'bottomright' ? 'flex-end' : 'center',
        pointerEvents: modal ? 'auto' : 'none'
    }),
    root: {
        display: 'flex',
        flexDirection: 'column',
        pointerEvents: 'auto'
    }
};

const classes = {
    mask: ({ props }: StyleContext) => {
        const positions = ['left', 'right', 'top', 'topleft', 'topright', 'bottom', 'bottomleft', 'bottomright'];
        const pos = positions.find((item) => item === props.position);

        return [
            'rs-dialog-mask',
            {
                'rs-overlay-mask rs-overlay-mask-enter-active': props.modal
            },
            pos ? `rs-dialog-${pos}` : ''
        ];
    },
    root: ({ props, instance }: StyleContext) => [
        'rs-dialog rs-component',
        {
            'rs-dialog-maximized': props.maximizable && instance.maximized
        }
    ],
    header: 'rs-dialog-header',
    title: 'rs-dialog-title',
    headerActions: 'rs-dialog-header-actions',
    pcMaximizeButton: 'rs-dialog-maximize-button',
    pcCloseButton: 'rs-dialog-close-button',
    content: 'rs-dialog-content',
    footer: 'rs-dialog-footer'
};

export default BaseStyle.extend({
    name: 'dialog',
    style,
    classes,
    inlineStyles
});
