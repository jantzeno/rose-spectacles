import { style } from '../../internal/styles/divider/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

/* Position */
const inlineStyles = {
    root: ({ props }: StyleContext) => ({
        justifyContent: props.layout === 'horizontal' ? (props.align === 'center' || props.align === null ? 'center' : props.align === 'left' ? 'flex-start' : props.align === 'right' ? 'flex-end' : null) : null,
        alignItems: props.layout === 'vertical' ? (props.align === 'center' || props.align === null ? 'center' : props.align === 'top' ? 'flex-start' : props.align === 'bottom' ? 'flex-end' : null) : null
    })
};

const classes = {
    root: ({ props }: StyleContext) => [
        'rs-divider rs-component',
        'rs-divider-' + props.layout,
        'rs-divider-' + props.type,
        { 'rs-divider-left': props.layout === 'horizontal' && (!props.align || props.align === 'left') },
        { 'rs-divider-center': props.layout === 'horizontal' && props.align === 'center' },
        { 'rs-divider-right': props.layout === 'horizontal' && props.align === 'right' },
        { 'rs-divider-top': props.layout === 'vertical' && props.align === 'top' },
        { 'rs-divider-center': props.layout === 'vertical' && (!props.align || props.align === 'center') },
        { 'rs-divider-bottom': props.layout === 'vertical' && props.align === 'bottom' }
    ],
    content: 'rs-divider-content'
};

export default BaseStyle.extend({
    name: 'divider',
    style,
    classes,
    inlineStyles
});
