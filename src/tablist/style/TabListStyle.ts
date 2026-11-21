import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: 'rs-tablist',
    content: 'rs-tablist-content rs-tablist-viewport',
    tabList: 'rs-tablist-tab-list',
    activeBar: 'rs-tablist-active-bar',
    prevButton: 'rs-tablist-prev-button rs-tablist-nav-button',
    nextButton: 'rs-tablist-next-button rs-tablist-nav-button'
};

export default BaseStyle.extend({
    name: 'tablist',
    classes
});
