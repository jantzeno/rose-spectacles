import { style } from '../../internal/styles/select/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ instance, props, state }) => [
        'rs-select rs-component rs-inputwrapper',
        {
            'rs-disabled': props.disabled,
            'rs-invalid': instance.$invalid,
            'rs-variant-filled': instance.$variant === 'filled',
            'rs-focus': state.focused,
            'rs-inputwrapper-filled': instance.$filled,
            'rs-inputwrapper-focus': state.focused || state.overlayVisible,
            'rs-select-open': state.overlayVisible,
            'rs-select-fluid': instance.$fluid,
            'rs-select-sm rs-inputfield-sm': props.size === 'small',
            'rs-select-lg rs-inputfield-lg': props.size === 'large'
        }
    ],
    label: ({ instance, props }) => [
        'rs-select-label',
        {
            'rs-placeholder': !props.editable && instance.label === props.placeholder,
            'rs-select-label-empty': !props.editable && !instance.$slots['value'] && (instance.label === 'rs-emptylabel' || instance.label?.length === 0)
        }
    ],
    clearIcon: 'rs-select-clear-icon',
    dropdown: 'rs-select-dropdown',
    loadingicon: 'rs-select-loading-icon',
    dropdownIcon: 'rs-select-dropdown-icon',
    overlay: 'rs-select-overlay rs-component',
    header: 'rs-select-header',
    pcFilter: 'rs-select-filter',
    listContainer: 'rs-select-list-container',
    list: 'rs-select-list',
    optionGroup: 'rs-select-option-group',
    optionGroupLabel: 'rs-select-option-group-label',
    option: ({ instance, props, state, option, focusedOption }) => [
        'rs-select-option',
        {
            'rs-select-option-selected': instance.isSelected(option) && props.highlightOnSelect,
            'rs-focus': state.focusedOptionIndex === focusedOption,
            'rs-disabled': instance.isOptionDisabled(option)
        }
    ],
    optionLabel: 'rs-select-option-label',
    optionCheckIcon: 'rs-select-option-check-icon',
    optionBlankIcon: 'rs-select-option-blank-icon',
    emptyMessage: 'rs-select-empty-message'
};

export default BaseStyle.extend({
    name: 'select',
    style,
    classes
});
