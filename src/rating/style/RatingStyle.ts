import { style } from '../../internal/styles/rating/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ props }: StyleContext) => [
        'rs-rating',
        {
            'rs-readonly': props.readonly,
            'rs-disabled': props.disabled
        }
    ],
    option: ({ instance, value }: StyleContext) => [
        'rs-rating-option',
        {
            'rs-rating-option-active': value <= instance.d_value,
            'rs-focus-visible': value === instance.focusedOptionIndex && instance.isFocusVisibleItem
        }
    ],
    onIcon: ({ instance }: StyleContext) => [
        'rs-rating-icon rs-rating-on-icon',
        {
            'rs-invalid': instance.$invalid
        }
    ],
    offIcon: ({ instance }: StyleContext) => [
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
