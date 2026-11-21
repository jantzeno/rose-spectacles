import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ instance }: StyleContext) => [
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
