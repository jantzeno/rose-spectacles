import { style } from '../../internal/styles/tabview/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ props }) => [
        'rs-tabview rs-component',
        {
            'rs-tabview-scrollable': props.scrollable
        }
    ],
    navContainer: 'rs-tabview-tablist-container',
    prevButton: 'rs-tabview-prev-button',
    navContent: 'rs-tabview-tablist-scroll-container',
    nav: 'rs-tabview-tablist',
    tab: {
        header: ({ instance, tab, index }) => [
            'rs-tabview-tablist-item',
            instance.getTabProp(tab, 'headerClass'),
            {
                'rs-tabview-tablist-item-active': instance.d_activeIndex === index,
                'rs-disabled': instance.getTabProp(tab, 'disabled')
            }
        ],
        headerAction: 'rs-tabview-tab-header',
        headerTitle: 'rs-tabview-tab-title',
        content: ({ instance, tab }) => ['rs-tabview-panel', instance.getTabProp(tab, 'contentClass')]
    },
    inkbar: 'rs-tabview-ink-bar',
    nextButton: 'rs-tabview-next-button',
    panelContainer: 'rs-tabview-panels'
};

export default BaseStyle.extend({
    name: 'tabview',
    style,
    classes
});
