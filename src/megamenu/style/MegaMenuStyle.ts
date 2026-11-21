import { style } from '../../internal/styles/megamenu/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const inlineStyles = {
    rootList: ({ props }: StyleContext) => ({ 'max-height': props.scrollHeight, overflow: 'auto' })
};

const classes = {
    root: ({ instance }: StyleContext) => [
        'rs-megamenu rs-component',
        {
            'rs-megamenu-mobile': instance.queryMatches,
            'rs-megamenu-mobile-active': instance.mobileActive,
            'rs-megamenu-horizontal': instance.horizontal,
            'rs-megamenu-vertical': instance.vertical
        }
    ],
    start: 'rs-megamenu-start',
    button: 'rs-megamenu-button',
    rootList: 'rs-megamenu-root-list',
    submenuLabel: ({ instance, processedItem }: StyleContext) => [
        'rs-megamenu-submenu-label',
        {
            'rs-disabled': instance.isItemDisabled(processedItem)
        }
    ],
    item: ({ instance, processedItem }: StyleContext) => [
        'rs-megamenu-item',
        {
            'rs-megamenu-item-active': instance.isItemActive(processedItem),
            'rs-focus': instance.isItemFocused(processedItem),
            'rs-disabled': instance.isItemDisabled(processedItem)
        }
    ],
    itemContent: 'rs-megamenu-item-content',
    itemLink: 'rs-megamenu-item-link',
    itemIcon: 'rs-megamenu-item-icon',
    itemLabel: 'rs-megamenu-item-label',
    submenuIcon: 'rs-megamenu-submenu-icon',
    overlay: 'rs-megamenu-overlay',
    grid: 'rs-megamenu-grid',
    column: ({ instance, processedItem }: StyleContext) => {
        let length = instance.isItemGroup(processedItem) ? processedItem.items.length : 0;
        let columnClass;

        if (instance.$parentInstance.queryMatches) columnClass = 'rs-megamenu-col-12';
        else {
            switch (length) {
                case 2:
                    columnClass = 'rs-megamenu-col-6';
                    break;

                case 3:
                    columnClass = 'rs-megamenu-col-4';
                    break;

                case 4:
                    columnClass = 'rs-megamenu-col-3';
                    break;

                case 6:
                    columnClass = 'rs-megamenu-col-2';
                    break;

                default:
                    columnClass = 'rs-megamenu-col-12';
                    break;
            }
        }

        return columnClass;
    },
    submenu: 'rs-megamenu-submenu',
    separator: 'rs-megamenu-separator',
    end: 'rs-megamenu-end'
};

export default BaseStyle.extend({
    name: 'megamenu',
    style,
    classes,
    inlineStyles
});
