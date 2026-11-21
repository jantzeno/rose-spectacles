import { style } from '../../internal/styles/drawer/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const inlineStyles = {
    mask: ({ position, modal }: StyleContext) => ({
        position: 'fixed',
        height: '100%',
        width: '100%',
        left: 0,
        top: 0,
        display: 'flex',
        justifyContent: position === 'left' ? 'flex-start' : position === 'right' ? 'flex-end' : 'center',
        alignItems: position === 'top' ? 'flex-start' : position === 'bottom' ? 'flex-end' : 'center',
        pointerEvents: modal ? 'auto' : 'none'
    }),
    root: {
        pointerEvents: 'auto'
    }
};

const classes = {
    mask: ({ instance, props }: StyleContext) => {
        const positions = ['left', 'right', 'top', 'bottom'];
        const pos = positions.find((item) => item === props.position);

        return [
            'rs-drawer-mask',
            {
                'rs-overlay-mask rs-overlay-mask-enter-active': props.modal,
                'rs-drawer-open': instance.containerVisible,
                'rs-drawer-full': instance.fullScreen
            },
            pos ? `rs-drawer-${pos}` : ''
        ];
    },
    root: ({ instance }: StyleContext) => [
        'rs-drawer rs-component',
        {
            'rs-drawer-full': instance.fullScreen
        }
    ],
    header: 'rs-drawer-header',
    title: 'rs-drawer-title',
    pcCloseButton: 'rs-drawer-close-button',
    content: 'rs-drawer-content',
    footer: 'rs-drawer-footer'
};

export default BaseStyle.extend({
    name: 'drawer',
    style,
    classes,
    inlineStyles
});
