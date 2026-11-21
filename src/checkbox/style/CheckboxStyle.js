import { style } from '../../internal/styles/checkbox/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ instance, props }) => [
        'rs-checkbox rs-component',
        {
            'rs-checkbox-checked': instance.checked,
            'rs-disabled': props.disabled,
            'rs-invalid': instance.$pcCheckboxGroup ? instance.$pcCheckboxGroup.$invalid : instance.$invalid,
            'rs-variant-filled': instance.$variant === 'filled',
            'rs-checkbox-sm rs-inputfield-sm': props.size === 'small',
            'rs-checkbox-lg rs-inputfield-lg': props.size === 'large'
        }
    ],
    box: 'rs-checkbox-box',
    input: 'rs-checkbox-input',
    icon: 'rs-checkbox-icon'
};

export default BaseStyle.extend({
    name: 'checkbox',
    style,
    classes
});
