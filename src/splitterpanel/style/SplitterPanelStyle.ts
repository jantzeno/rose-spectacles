import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ instance }: StyleContext) => ['rs-splitterpanel', { 'rs-splitterpanel-nested': instance.isNested }]
};

export default BaseStyle.extend({
    name: 'splitterpanel',
    classes
});
