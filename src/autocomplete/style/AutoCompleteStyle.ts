import { style } from '../../internal/styles/autocomplete/index';
import { isNotEmpty } from '../../internal/utils/object/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const inlineStyles = {
    root: { position: 'relative' }
};

const classes = {
    root: ({ instance }: StyleContext) => [
        'rs-autocomplete rs-component rs-inputwrapper',
        {
            'rs-invalid': instance.$invalid,
            'rs-focus': instance.focused,
            'rs-inputwrapper-filled': instance.$filled || isNotEmpty(instance.inputValue),
            'rs-inputwrapper-focus': instance.focused,
            'rs-autocomplete-open': instance.overlayVisible,
            'rs-autocomplete-fluid': instance.$fluid,
            'rs-autocomplete-clearable': instance.isClearIconVisible
        }
    ],
    pcInputText: 'rs-autocomplete-input',
    inputMultiple: ({ instance, props }: StyleContext) => [
        'rs-autocomplete-input-multiple',
        {
            'rs-variant-filled': instance.$variant === 'filled',
            'rs-disabled': props.disabled
        }
    ],
    clearIcon: 'rs-autocomplete-clear-icon',
    chipItem: ({ instance, i }: StyleContext) => [
        'rs-autocomplete-chip-item',
        {
            'rs-focus': instance.focusedMultipleOptionIndex === i
        }
    ],
    pcChip: 'rs-autocomplete-chip',
    chipIcon: 'rs-autocomplete-chip-icon',
    inputChip: 'rs-autocomplete-input-chip',
    loader: 'rs-autocomplete-loader',
    dropdown: 'rs-autocomplete-dropdown',
    overlay: 'rs-autocomplete-overlay rs-component',
    listContainer: 'rs-autocomplete-list-container',
    list: 'rs-autocomplete-list',
    optionGroup: 'rs-autocomplete-option-group',
    option: ({ instance, option, i, getItemOptions }: StyleContext) => [
        'rs-autocomplete-option',
        {
            'rs-autocomplete-option-selected': instance.isSelected(option),
            'rs-focus': instance.focusedOptionIndex === instance.getOptionIndex(i, getItemOptions),
            'rs-disabled': instance.isOptionDisabled(option)
        }
    ],
    emptyMessage: 'rs-autocomplete-empty-message'
};

export default BaseStyle.extend({
    name: 'autocomplete',
    style,
    classes,
    inlineStyles
});
