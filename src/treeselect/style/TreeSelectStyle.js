import { style } from '../../internal/styles/treeselect/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const inlineStyles = {
    root: ({ props }) => ({ position: props.appendTo === 'self' ? 'relative' : undefined })
};

const classes = {
    root: ({ instance, props }) => [
        'rs-treeselect rs-component rs-inputwrapper',
        {
            'rs-treeselect-display-chip': props.display === 'chip',
            'rs-disabled': props.disabled,
            'rs-invalid': instance.$invalid,
            'rs-focus': instance.focused,
            'rs-variant-filled': instance.$variant === 'filled',
            'rs-inputwrapper-filled': instance.$filled,
            'rs-inputwrapper-focus': instance.focused || instance.overlayVisible,
            'rs-treeselect-open': instance.overlayVisible,
            'rs-treeselect-fluid': instance.$fluid,
            'rs-treeselect-sm rs-inputfield-sm': props.size === 'small',
            'rs-treeselect-lg rs-inputfield-lg': props.size === 'large'
        }
    ],
    labelContainer: 'rs-treeselect-label-container',
    label: ({ instance, props }) => [
        'rs-treeselect-label',
        {
            'rs-placeholder': instance.label === props.placeholder,
            'rs-treeselect-label-empty': !props.placeholder && instance.emptyValue
        }
    ],
    clearIcon: 'rs-treeselect-clear-icon',
    chip: 'rs-treeselect-chip-item',
    pcChip: 'rs-treeselect-chip',
    dropdown: 'rs-treeselect-dropdown',
    dropdownIcon: 'rs-treeselect-dropdown-icon',
    panel: 'rs-treeselect-overlay rs-component',
    treeContainer: 'rs-treeselect-tree-container',
    emptyMessage: 'rs-treeselect-empty-message'
};

export default BaseStyle.extend({
    name: 'treeselect',
    style,
    classes,
    inlineStyles
});
