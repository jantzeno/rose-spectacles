import { style } from '../../internal/styles/menu/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ props }) => [
        'rs-menu rs-component',
        {
            'rs-menu-overlay': props.popup
        }
    ],
    start: 'rs-menu-start',
    list: 'rs-menu-list',
    submenuLabel: 'rs-menu-submenu-label',
    separator: 'rs-menu-separator',
    end: 'rs-menu-end',
    item: ({ instance }) => [
        'rs-menu-item',
        {
            'rs-focus': instance.id === instance.focusedOptionId,
            'rs-disabled': instance.disabled()
        }
    ],
    itemContent: 'rs-menu-item-content',
    itemLink: 'rs-menu-item-link',
    itemIcon: 'rs-menu-item-icon',
    itemLabel: 'rs-menu-item-label'
};

export default BaseStyle.extend({
    name: 'menu',
    style,
    classes
});
