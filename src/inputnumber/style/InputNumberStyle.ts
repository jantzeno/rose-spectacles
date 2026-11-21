import { style } from '../../internal/styles/inputnumber/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ instance, props }: StyleContext) => [
        'rs-inputnumber rs-component rs-inputwrapper',
        {
            'rs-invalid': instance.$invalid,
            'rs-inputwrapper-filled': instance.$filled || props.allowEmpty === false,
            'rs-inputwrapper-focus': instance.focused,
            'rs-inputnumber-stacked': props.showButtons && props.buttonLayout === 'stacked',
            'rs-inputnumber-horizontal': props.showButtons && props.buttonLayout === 'horizontal',
            'rs-inputnumber-vertical': props.showButtons && props.buttonLayout === 'vertical',
            'rs-inputnumber-fluid': instance.$fluid
        }
    ],
    pcInputText: 'rs-inputnumber-input',
    clearIcon: 'rs-inputnumber-clear-icon',
    buttonGroup: 'rs-inputnumber-button-group',
    incrementButton: ({ instance, props }: StyleContext) => [
        'rs-inputnumber-button rs-inputnumber-increment-button',
        {
            'rs-disabled': props.showButtons && props.max !== null && instance.maxBoundry()
        }
    ],
    decrementButton: ({ instance, props }: StyleContext) => [
        'rs-inputnumber-button rs-inputnumber-decrement-button',
        {
            'rs-disabled': props.showButtons && props.min !== null && instance.minBoundry()
        }
    ]
};

export default BaseStyle.extend({
    name: 'inputnumber',
    style,
    classes
});
