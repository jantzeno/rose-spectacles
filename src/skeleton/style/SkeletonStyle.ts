import { style } from '../../internal/styles/skeleton/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const inlineStyles = {
    root: { position: 'relative' }
};

const classes = {
    root: ({ props }: StyleContext) => [
        'rs-skeleton rs-component',
        {
            'rs-skeleton-circle': props.shape === 'circle',
            'rs-skeleton-animation-none': props.animation === 'none'
        }
    ]
};

export default BaseStyle.extend({
    name: 'skeleton',
    style,
    classes,
    inlineStyles
});
