import { style } from '../../internal/styles/paginator/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    paginator: ({ instance, key }) => [
        'rs-paginator rs-component',
        {
            'rs-paginator-default': !instance.hasBreakpoints(),
            [`rs-paginator-${key}`]: instance.hasBreakpoints()
        }
    ],
    content: 'rs-paginator-content',
    contentStart: 'rs-paginator-content-start',
    contentEnd: 'rs-paginator-content-end',
    first: ({ instance }) => [
        'rs-paginator-first',
        {
            'rs-disabled': instance.$attrs.disabled
        }
    ],
    firstIcon: 'rs-paginator-first-icon',
    prev: ({ instance }) => [
        'rs-paginator-prev',
        {
            'rs-disabled': instance.$attrs.disabled
        }
    ],
    prevIcon: 'rs-paginator-prev-icon',
    next: ({ instance }) => [
        'rs-paginator-next',
        {
            'rs-disabled': instance.$attrs.disabled
        }
    ],
    nextIcon: 'rs-paginator-next-icon',
    last: ({ instance }) => [
        'rs-paginator-last',
        {
            'rs-disabled': instance.$attrs.disabled
        }
    ],
    lastIcon: 'rs-paginator-last-icon',
    pages: 'rs-paginator-pages',
    page: ({ props, pageLink }) => [
        'rs-paginator-page',
        {
            'rs-paginator-page-selected': pageLink - 1 === props.page
        }
    ],
    current: 'rs-paginator-current',
    pcRowPerPageDropdown: 'rs-paginator-rpp-dropdown',
    pcJumpToPageDropdown: 'rs-paginator-jtp-dropdown',
    pcJumpToPageInputText: 'rs-paginator-jtp-input'
};

export default BaseStyle.extend({
    name: 'paginator',
    style,
    classes
});
