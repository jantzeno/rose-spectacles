import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ instance }) => [
        'rs-tabpanel',
        {
            'rs-tabpanel-active': instance.active
        }
    ]
};

export default BaseStyle.extend({
    name: 'tabpanel',
    classes
});
