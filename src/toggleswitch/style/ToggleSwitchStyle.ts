import { style } from '../../internal/styles/toggleswitch/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const inlineStyles = {
    root: { position: 'relative' }
};

const classes = {
    root: ({ instance, props }: StyleContext) => [
        'rs-toggleswitch rs-component',
        {
            'rs-toggleswitch-checked': instance.checked,
            'rs-disabled': props.disabled,
            'rs-invalid': instance.$invalid
        }
    ],
    input: 'rs-toggleswitch-input',
    slider: 'rs-toggleswitch-slider',
    handle: 'rs-toggleswitch-handle'
};

export default BaseStyle.extend({
    name: 'toggleswitch',
    style,
    classes,
    inlineStyles
});
