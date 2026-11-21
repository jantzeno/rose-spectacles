import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ instance }) => [
        'rs-steppanel',
        {
            'rs-steppanel-active': instance.isVertical && instance.active
        }
    ],
    contentWrapper: 'rs-steppanel-content-wrapper',
    content: 'rs-steppanel-content'
};

export default BaseStyle.extend({
    name: 'steppanel',
    classes
});
