import { style } from '../../internal/styles/multiselect/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const inlineStyles = {
    root: ({ props }) => ({ position: props.appendTo === 'self' ? 'relative' : undefined })
};

const classes = {
    root: ({ instance, props }) => [
        'rs-multiselect rs-component rs-inputwrapper',
        {
            'rs-multiselect-display-chip': props.display === 'chip',
            'rs-disabled': props.disabled,
            'rs-invalid': instance.$invalid,
            'rs-variant-filled': instance.$variant === 'filled',
            'rs-focus': instance.focused,
            'rs-inputwrapper-filled': instance.$filled,
            'rs-inputwrapper-focus': instance.focused || instance.overlayVisible,
            'rs-multiselect-open': instance.overlayVisible,
            'rs-multiselect-fluid': instance.$fluid,
            'rs-multiselect-sm rs-inputfield-sm': props.size === 'small',
            'rs-multiselect-lg rs-inputfield-lg': props.size === 'large'
        }
    ],
    labelContainer: 'rs-multiselect-label-container',
    label: ({ instance, props }) => [
        'rs-multiselect-label',
        {
            'rs-placeholder': instance.label === props.placeholder,
            'rs-multiselect-label-empty': !props.placeholder && !instance.selectedValues.length
        }
    ],
    clearIcon: 'rs-multiselect-clear-icon',
    chipItem: 'rs-multiselect-chip-item',
    pcChip: 'rs-multiselect-chip',
    chipIcon: 'rs-multiselect-chip-icon',
    dropdown: 'rs-multiselect-dropdown',
    loadingIcon: 'rs-multiselect-loading-icon',
    dropdownIcon: 'rs-multiselect-dropdown-icon',
    overlay: 'rs-multiselect-overlay rs-component',
    header: 'rs-multiselect-header',
    pcFilterContainer: 'rs-multiselect-filter-container',
    pcFilter: 'rs-multiselect-filter',
    listContainer: 'rs-multiselect-list-container',
    list: 'rs-multiselect-list',
    optionGroup: 'rs-multiselect-option-group',
    option: ({ instance, option, index, getItemOptions, props }) => [
        'rs-multiselect-option',
        {
            'rs-multiselect-option-selected': instance.isSelected(option) && props.highlightOnSelect,
            'rs-focus': instance.focusedOptionIndex === instance.getOptionIndex(index, getItemOptions),
            'rs-disabled': instance.isOptionDisabled(option)
        }
    ],
    emptyMessage: 'rs-multiselect-empty-message'
};

export default BaseStyle.extend({
    name: 'multiselect',
    style,
    classes,
    inlineStyles
});
