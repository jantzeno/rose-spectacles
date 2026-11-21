import { style } from '../../internal/styles/inlinemessage/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ props, instance }) => ['rs-inlinemessage rs-component rs-inlinemessage-' + props.severity, { 'rs-inlinemessage-icon-only': !instance.$slots.default }],
    icon: ({ props }) => ['rs-inlinemessage-icon', props.icon],
    text: 'rs-inlinemessage-text'
};

export default BaseStyle.extend({
    name: 'inlinemessage',
    style,
    classes
});
