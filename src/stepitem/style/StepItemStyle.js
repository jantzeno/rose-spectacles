import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ instance }) => [
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
