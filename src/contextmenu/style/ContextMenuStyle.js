import { style } from '../../internal/styles/contextmenu/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ instance }) => [
        'rs-contextmenu rs-component',
        {
            'rs-contextmenu-mobile': instance.queryMatches
        }
    ],
    rootList: 'rs-contextmenu-root-list',
    item: ({ instance, processedItem }) => [
        'rs-contextmenu-item',
        {
            'rs-contextmenu-item-active': instance.isItemActive(processedItem),
            'rs-focus': instance.isItemFocused(processedItem),
            'rs-disabled': instance.isItemDisabled(processedItem)
        }
    ],
    itemContent: 'rs-contextmenu-item-content',
    itemLink: 'rs-contextmenu-item-link',
    itemIcon: 'rs-contextmenu-item-icon',
    itemLabel: 'rs-contextmenu-item-label',
    submenuIcon: 'rs-contextmenu-submenu-icon',
    submenu: 'rs-contextmenu-submenu',
    separator: 'rs-contextmenu-separator'
};

export default BaseStyle.extend({
    name: 'contextmenu',
    style,
    classes
});
