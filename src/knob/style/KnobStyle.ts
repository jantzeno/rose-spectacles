import { style } from '../../internal/styles/knob/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ instance, props }: StyleContext) => [
        'rs-knob rs-component',
        {
            'rs-disabled': props.disabled,
            'rs-invalid': instance.$invalid
        }
    ],
    range: 'rs-knob-range',
    value: 'rs-knob-value',
    text: 'rs-knob-text'
};

export default BaseStyle.extend({
    name: 'knob',
    style,
    classes
});
