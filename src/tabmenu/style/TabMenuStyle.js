import { style } from '../../internal/styles/tabmenu/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: 'rs-tabmenu rs-component',
    tablist: 'rs-tabmenu-tablist',
    item: ({ instance, index, item }) => [
        'rs-tabmenu-item',
        {
            'rs-tabmenu-item-active': instance.d_activeIndex === index,
            'rs-disabled': instance.disabled(item)
        }
    ],
    itemLink: 'rs-tabmenu-item-link',
    itemIcon: 'rs-tabmenu-item-icon',
    itemLabel: 'rs-tabmenu-item-label',
    activeBar: 'rs-tabmenu-active-bar'
};

export default BaseStyle.extend({
    name: 'tabmenu',
    style,
    classes
});
