import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ instance, props }: StyleContext) => [
        'rs-tab',
        {
            'rs-tab-active': instance.active,
            'rs-disabled': props.disabled
        }
    ]
};

export default BaseStyle.extend({
    name: 'tab',
    classes
});
