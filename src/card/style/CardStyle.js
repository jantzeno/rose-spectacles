import { style } from '../../internal/styles/card/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: 'rs-card rs-component',
    header: 'rs-card-header',
    body: 'rs-card-body',
    caption: 'rs-card-caption',
    title: 'rs-card-title',
    subtitle: 'rs-card-subtitle',
    content: 'rs-card-content',
    footer: 'rs-card-footer'
};

export default BaseStyle.extend({
    name: 'card',
    style,
    classes
});
