import { style } from '../../internal/styles/dataview/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ props }: StyleContext) => [
        'rs-dataview rs-component',
        {
            'rs-dataview-list': props.layout === 'list',
            'rs-dataview-grid': props.layout === 'grid'
        }
    ],
    header: 'rs-dataview-header',
    pcPaginator: ({ position }: StyleContext) => 'rs-dataview-paginator-' + position,
    content: 'rs-dataview-content',
    emptyMessage: 'rs-dataview-empty-message', // TODO: remove?
    footer: 'rs-dataview-footer'
};

export default BaseStyle.extend({
    name: 'dataview',
    style,
    classes
});
