import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ instance, props }) => [
        'rs-accordionpanel',
        {
            'rs-accordionpanel-active': instance.active,
            'rs-disabled': props.disabled
        }
    ]
};

export default BaseStyle.extend({
    name: 'accordionpanel',
    classes
});
