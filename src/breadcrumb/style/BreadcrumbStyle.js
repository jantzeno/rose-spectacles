import { style } from '../../internal/styles/breadcrumb/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: 'rs-breadcrumb rs-component',
    list: 'rs-breadcrumb-list',
    homeItem: 'rs-breadcrumb-home-item',
    separator: 'rs-breadcrumb-separator',
    separatorIcon: 'rs-breadcrumb-separator-icon',
    item: ({ instance }) => ['rs-breadcrumb-item', { 'rs-disabled': instance.disabled() }],
    itemLink: 'rs-breadcrumb-item-link',
    itemIcon: 'rs-breadcrumb-item-icon',
    itemLabel: 'rs-breadcrumb-item-label'
};

export default BaseStyle.extend({
    name: 'breadcrumb',
    style,
    classes
});
