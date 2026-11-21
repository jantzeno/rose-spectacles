import { style } from '../../internal/styles/tag/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ props }: StyleContext) => [
        'rs-tag rs-component',
        {
            'rs-tag-info': props.severity === 'info',
            'rs-tag-success': props.severity === 'success',
            'rs-tag-warn': props.severity === 'warn',
            'rs-tag-danger': props.severity === 'danger',
            'rs-tag-secondary': props.severity === 'secondary',
            'rs-tag-contrast': props.severity === 'contrast',
            'rs-tag-rounded': props.rounded
        }
    ],
    icon: 'rs-tag-icon',
    label: 'rs-tag-label'
};

export default BaseStyle.extend({
    name: 'tag',
    style,
    classes
});
