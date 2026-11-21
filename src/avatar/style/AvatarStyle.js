import { style } from '../../internal/styles/avatar/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ props }) => [
        'rs-avatar rs-component',
        {
            'rs-avatar-image': props.image != null,
            'rs-avatar-circle': props.shape === 'circle',
            'rs-avatar-lg': props.size === 'large',
            'rs-avatar-xl': props.size === 'xlarge'
        }
    ],
    label: 'rs-avatar-label',
    icon: 'rs-avatar-icon'
};

export default BaseStyle.extend({
    name: 'avatar',
    style,
    classes
});
