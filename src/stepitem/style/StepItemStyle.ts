import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ instance }: StyleContext) => [
        'rs-stepitem',
        {
            'rs-stepitem-active': instance.isActive
        }
    ]
};

export default BaseStyle.extend({
    name: 'stepitem',
    classes
});
