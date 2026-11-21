import { style } from '../../internal/styles/speeddial/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

/* Direction */
const inlineStyles = {
    root: ({ props }: StyleContext) => ({
        alignItems: (props.direction === 'up' || props.direction === 'down') && 'center',
        justifyContent: (props.direction === 'left' || props.direction === 'right') && 'center',
        flexDirection:
            props.direction === 'up'
                ? 'column-reverse'
                : props.direction === 'down'
                  ? 'column'
                  : props.direction === 'left'
                    ? 'row-reverse'
                    : props.direction === 'right'
                      ? 'row'
                      : null
    }),
    list: ({ props }: StyleContext) => ({
        flexDirection:
            props.direction === 'up'
                ? 'column-reverse'
                : props.direction === 'down'
                  ? 'column'
                  : props.direction === 'left'
                    ? 'row-reverse'
                    : props.direction === 'right'
                      ? 'row'
                      : null
    })
};

const classes = {
    root: ({ instance, props }: StyleContext) => [
        `rs-speeddial rs-component rs-speeddial-${props.type}`,
        {
            [`rs-speeddial-direction-${props.direction}`]: props.type !== 'circle',
            'rs-speeddial-open': instance.d_visible,
            'rs-disabled': props.disabled
        }
    ],
    pcButton: ({ props }: StyleContext) => [
        'rs-speeddial-button',
        {
            'rs-speeddial-rotate': props.rotateAnimation && !props.hideIcon
        }
    ],
    list: 'rs-speeddial-list',
    item: ({ item }: StyleContext) => [
        'rs-speeddial-item',
        {
            'rs-disabled': item && (typeof item.disabled === 'function' ? item.disabled() : item.disabled)
        }
    ],
    action: 'rs-speeddial-action',
    actionIcon: 'rs-speeddial-action-icon',
    mask: 'rs-speeddial-mask rs-overlay-mask'
};

export default BaseStyle.extend({
    name: 'speeddial',
    style,
    classes,
    inlineStyles
});
