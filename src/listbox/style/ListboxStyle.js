import { style } from '../../internal/styles/listbox/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ instance, props }) => [
        'rs-listbox rs-component',
        {
            'rs-listbox-striped': props.striped,
            'rs-disabled': props.disabled,
            'rs-listbox-fluid': props.fluid,
            'rs-invalid': instance.$invalid
        }
    ],
    header: 'rs-listbox-header',
    pcFilter: 'rs-listbox-filter',
    listContainer: 'rs-listbox-list-container',
    list: 'rs-listbox-list',
    optionGroup: 'rs-listbox-option-group',
    option: ({ instance, props, option, index, getItemOptions }) => [
        'rs-listbox-option',
        {
            'rs-listbox-option-selected': instance.isSelected(option) && props.highlightOnSelect,
            'rs-focus': instance.focusedOptionIndex === instance.getOptionIndex(index, getItemOptions),
            'rs-disabled': instance.isOptionDisabled(option)
        }
    ],
    optionCheckIcon: 'rs-listbox-option-check-icon',
    optionBlankIcon: 'rs-listbox-option-blank-icon',
    emptyMessage: 'rs-listbox-empty-message'
};

export default BaseStyle.extend({
    name: 'listbox',
    style,
    classes
});
