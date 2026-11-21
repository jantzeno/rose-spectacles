import { style } from '../../internal/styles/inputchips/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ instance, props }) => [
        'rs-inputchips rs-component rs-inputwrapper',
        {
            'rs-disabled': props.disabled,
            'rs-invalid': props.invalid,
            'rs-focus': instance.focused,
            'rs-inputwrapper-filled': (props.modelValue && props.modelValue.length) || (instance.inputValue && instance.inputValue.length),
            'rs-inputwrapper-focus': instance.focused
        }
    ],
    input: ({ props, instance }) => [
        'rs-inputchips-input',
        {
            'rs-variant-filled': props.variant ? props.variant === 'filled' : instance.$primevue.config.inputStyle === 'filled' || instance.$primevue.config.inputVariant === 'filled'
        }
    ],
    chipItem: ({ state, index }) => ['rs-inputchips-chip-item', { 'rs-focus': state.focusedIndex === index }],
    pcChip: 'rs-inputchips-chip',
    chipIcon: 'rs-inputchips-chip-icon',
    inputItem: 'rs-inputchips-input-item'
};

export default BaseStyle.extend({
    name: 'inputchips',
    style,
    classes
});
