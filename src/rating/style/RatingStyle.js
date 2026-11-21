import { style } from '../../internal/styles/rating/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ props }) => [
        'rs-rating',
        {
            'rs-readonly': props.readonly,
            'rs-disabled': props.disabled
        }
    ],
    option: ({ instance, value }) => [
        'rs-rating-option',
        {
            'rs-rating-option-active': value <= instance.d_value,
            'rs-focus-visible': value === instance.focusedOptionIndex && instance.isFocusVisibleItem
        }
    ],
    onIcon: ({ instance }) => [
        'rs-rating-icon rs-rating-on-icon',
        {
            'rs-invalid': instance.$invalid
        }
    ],
    offIcon: ({ instance }) => [
        'rs-rating-icon rs-rating-off-icon',
        {
            'rs-invalid': instance.$invalid
        }
    ]
};

export default BaseStyle.extend({
    name: 'rating',
    style,
    classes
});
