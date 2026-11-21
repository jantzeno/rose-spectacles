import { style } from '../../internal/styles/menubar/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const inlineStyles = {
    submenu: ({ instance, processedItem }: StyleContext) => ({ display: instance.isItemActive(processedItem) ? 'flex' : 'none' })
};

const classes = {
    root: ({ instance }: StyleContext) => [
        'rs-menubar rs-component',
        {
            'rs-menubar-mobile': instance.queryMatches,
            'rs-menubar-mobile-active': instance.mobileActive
        }
    ],
    start: 'rs-menubar-start',
    button: 'rs-menubar-button',
    rootList: 'rs-menubar-root-list',
    item: ({ instance, processedItem }: StyleContext) => [
        'rs-menubar-item',
        {
            'rs-menubar-item-active': instance.isItemActive(processedItem),
            'rs-focus': instance.isItemFocused(processedItem),
            'rs-disabled': instance.isItemDisabled(processedItem)
        }
    ],
    itemContent: 'rs-menubar-item-content',
    itemLink: 'rs-menubar-item-link',
    itemIcon: 'rs-menubar-item-icon',
    itemLabel: 'rs-menubar-item-label',
    submenuIcon: 'rs-menubar-submenu-icon',
    submenu: 'rs-menubar-submenu',
    separator: 'rs-menubar-separator',
    end: 'rs-menubar-end'
};

export default BaseStyle.extend({
    name: 'menubar',
    style,
    classes,
    inlineStyles
});
