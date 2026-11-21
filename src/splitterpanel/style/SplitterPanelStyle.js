import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ instance }) => ['rs-splitterpanel', { 'rs-splitterpanel-nested': instance.isNested }]
};

export default BaseStyle.extend({
    name: 'splitterpanel',
    classes
});
