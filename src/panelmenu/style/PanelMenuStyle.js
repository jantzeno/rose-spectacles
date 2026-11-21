import { style } from '../../internal/styles/panelmenu/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: 'rs-panelmenu rs-component',
    panel: 'rs-panelmenu-panel',
    header: ({ instance, item }) => [
        'rs-panelmenu-header',
        {
            'rs-panelmenu-header-active': instance.isItemActive(item) && !!item.items,
            'rs-disabled': instance.isItemDisabled(item)
        }
    ],
    headerContent: 'rs-panelmenu-header-content',
    headerLink: 'rs-panelmenu-header-link',
    headerIcon: 'rs-panelmenu-header-icon',
    headerLabel: 'rs-panelmenu-header-label',
    contentContainer: 'rs-panelmenu-content-container',
    contentWrapper: 'rs-panelmenu-content-wrapper',
    content: 'rs-panelmenu-content',
    rootList: 'rs-panelmenu-root-list',
    item: ({ instance, processedItem }) => [
        'rs-panelmenu-item',
        {
            'rs-focus': instance.isItemFocused(processedItem),
            'rs-disabled': instance.isItemDisabled(processedItem)
        }
    ],
    itemContent: 'rs-panelmenu-item-content',
    itemLink: 'rs-panelmenu-item-link',
    itemIcon: 'rs-panelmenu-item-icon',
    itemLabel: 'rs-panelmenu-item-label',
    submenuIcon: 'rs-panelmenu-submenu-icon',
    submenu: 'rs-panelmenu-submenu',
    separator: 'rs-menuitem-separator'
};

export default BaseStyle.extend({
    name: 'panelmenu',
    style,
    classes
});
