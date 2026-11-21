import { style } from '../../internal/styles/dock/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ instance, props }: StyleContext) => [
        'rs-dock rs-component',
        `rs-dock-${props.position}`,
        {
            'rs-dock-mobile': instance.queryMatches
        }
    ],
    listContainer: 'rs-dock-list-container',
    list: 'rs-dock-list',
    item: ({ instance, processedItem, id }: StyleContext) => [
        'rs-dock-item',
        {
            'rs-focus': instance.isItemActive(id),
            'rs-disabled': instance.disabled(processedItem)
        }
    ],
    itemContent: 'rs-dock-item-content',
    itemLink: 'rs-dock-item-link',
    itemIcon: 'rs-dock-item-icon'
};

export default BaseStyle.extend({
    name: 'dock',
    style,
    classes
});
