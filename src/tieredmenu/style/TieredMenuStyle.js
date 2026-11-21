import { style } from '../../internal/styles/tieredmenu/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const inlineStyles = {
    submenu: ({ instance, processedItem }) => ({ display: instance.isItemActive(processedItem) ? 'flex' : 'none' })
};

const classes = {
    root: ({ props, instance }) => [
        'rs-tieredmenu rs-component',
        {
            'rs-tieredmenu-overlay': props.popup,
            'rs-tieredmenu-mobile': instance.queryMatches
        }
    ],
    start: 'rs-tieredmenu-start',
    rootList: 'rs-tieredmenu-root-list',
    item: ({ instance, processedItem }) => [
        'rs-tieredmenu-item',
        {
            'rs-tieredmenu-item-active': instance.isItemActive(processedItem),
            'rs-focus': instance.isItemFocused(processedItem),
            'rs-disabled': instance.isItemDisabled(processedItem)
        }
    ],
    itemContent: 'rs-tieredmenu-item-content',
    itemLink: 'rs-tieredmenu-item-link',
    itemIcon: 'rs-tieredmenu-item-icon',
    itemLabel: 'rs-tieredmenu-item-label',
    submenuIcon: 'rs-tieredmenu-submenu-icon',
    submenu: 'rs-tieredmenu-submenu',
    separator: 'rs-tieredmenu-separator',
    end: 'rs-tieredmenu-end'
};

export default BaseStyle.extend({
    name: 'tieredmenu',
    style,
    classes,
    inlineStyles
});
