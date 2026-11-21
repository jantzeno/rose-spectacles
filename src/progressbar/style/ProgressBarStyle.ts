import { style } from '../../internal/styles/progressbar/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ instance }: StyleContext) => [
        'rs-progressbar rs-component',
        {
            'rs-progressbar-determinate': instance.determinate,
            'rs-progressbar-indeterminate': instance.indeterminate
        }
    ],
    value: 'rs-progressbar-value',
    label: 'rs-progressbar-label'
};

export default BaseStyle.extend({
    name: 'progressbar',
    style,
    classes
});
