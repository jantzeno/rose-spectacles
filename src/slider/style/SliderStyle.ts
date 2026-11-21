import { style } from '../../internal/styles/slider/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const inlineStyles = {
    handle: { position: 'absolute' },
    range: { position: 'absolute' }
};

const classes = {
    root: ({ instance, props }: StyleContext) => [
        'rs-slider rs-component',
        {
            'rs-disabled': props.disabled,
            'rs-invalid': instance.$invalid,
            'rs-slider-horizontal': props.orientation === 'horizontal',
            'rs-slider-vertical': props.orientation === 'vertical'
        }
    ],
    range: 'rs-slider-range',
    handle: 'rs-slider-handle'
};

export default BaseStyle.extend({
    name: 'slider',
    style,
    classes,
    inlineStyles
});
