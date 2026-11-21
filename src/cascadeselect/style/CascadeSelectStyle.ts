import { style } from '../../internal/styles/cascadeselect/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const inlineStyles = {
    root: ({ props }: StyleContext) => ({ position: props.appendTo === 'self' ? 'relative' : undefined })
};

const classes = {
    root: ({ instance, props }: StyleContext) => [
        'rs-cascadeselect rs-component rs-inputwrapper',
        {
            'rs-cascadeselect-mobile': instance.queryMatches,
            'rs-disabled': props.disabled,
            'rs-invalid': instance.$invalid,
            'rs-variant-filled': instance.$variant === 'filled',
            'rs-focus': instance.focused,
            'rs-inputwrapper-filled': instance.$filled,
            'rs-inputwrapper-focus': instance.focused || instance.overlayVisible,
            'rs-cascadeselect-open': instance.overlayVisible,
            'rs-cascadeselect-fluid': instance.$fluid,
            'rs-cascadeselect-sm rs-inputfield-sm': props.size === 'small',
            'rs-cascadeselect-lg rs-inputfield-lg': props.size === 'large'
        }
    ],
    label: ({ instance, props }: StyleContext) => [
        'rs-cascadeselect-label',
        {
            'rs-placeholder': instance.label === props.placeholder,
            'rs-cascadeselect-label-empty': !instance.$slots['value'] && (instance.label === 'rs-emptylabel' || instance.label?.length === 0)
        }
    ],
    clearIcon: 'rs-cascadeselect-clear-icon',
    dropdown: 'rs-cascadeselect-dropdown',
    loadingIcon: 'rs-cascadeselect-loading-icon',
    dropdownIcon: 'rs-cascadeselect-dropdown-icon',
    overlay: ({ instance }: StyleContext) => [
        'rs-cascadeselect-overlay rs-component',
        {
            'rs-cascadeselect-mobile-active': instance.queryMatches
        }
    ],
    listContainer: 'rs-cascadeselect-list-container',
    list: 'rs-cascadeselect-list',
    option: ({ instance, processedOption }: StyleContext) => [
        'rs-cascadeselect-option',
        {
            'rs-cascadeselect-option-active': instance.isOptionActive(processedOption),
            'rs-cascadeselect-option-selected': instance.isOptionSelected(processedOption),
            'rs-focus': instance.isOptionFocused(processedOption),
            'rs-disabled': instance.isOptionDisabled(processedOption)
        }
    ],
    optionContent: 'rs-cascadeselect-option-content',
    optionText: 'rs-cascadeselect-option-text',
    groupIconContainer: 'rs-cascadeselect-group-icon-container',
    groupIcon: 'rs-cascadeselect-group-icon',
    optionList: 'rs-cascadeselect-overlay rs-cascadeselect-option-list'
};

export default BaseStyle.extend({
    name: 'cascadeselect',
    style,
    classes,
    inlineStyles
});
