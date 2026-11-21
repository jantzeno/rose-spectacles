import { style } from '../../internal/styles/colorpicker/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: 'rs-colorpicker rs-component',
    preview: ({ props }: StyleContext) => ['rs-colorpicker-preview', { 'rs-disabled': props.disabled }],
    panel: ({ instance, props }: StyleContext) => [
        'rs-colorpicker-panel',
        {
            'rs-colorpicker-panel-inline': props.inline,
            'rs-disabled': props.disabled,
            'rs-invalid': instance.$invalid
        }
    ],
    colorSelector: 'rs-colorpicker-color-selector',
    colorBackground: 'rs-colorpicker-color-background',
    colorHandle: 'rs-colorpicker-color-handle',
    hue: 'rs-colorpicker-hue',
    hueHandle: 'rs-colorpicker-hue-handle'
};

export default BaseStyle.extend({
    name: 'colorpicker',
    style,
    classes
});
