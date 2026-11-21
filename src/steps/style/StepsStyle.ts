import { style } from '../../internal/styles/steps/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ props }: StyleContext) => ['rs-steps rs-component', { 'rs-readonly': props.readonly }],
    list: 'rs-steps-list',
    item: ({ instance, item, index }: StyleContext) => [
        'rs-steps-item',
        {
            'rs-steps-item-active': instance.isActive(index),
            'rs-disabled': instance.isItemDisabled(item, index)
        }
    ],
    itemLink: 'rs-steps-item-link',
    itemNumber: 'rs-steps-item-number',
    itemLabel: 'rs-steps-item-label'
};

export default BaseStyle.extend({
    name: 'steps',
    style,
    classes
});
