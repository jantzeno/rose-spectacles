import { style } from '../../internal/styles/inlinemessage/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ props, instance }: StyleContext) => ['rs-inlinemessage rs-component rs-inlinemessage-' + props.severity, { 'rs-inlinemessage-icon-only': !instance.$slots.default }],
    icon: ({ props }: StyleContext) => ['rs-inlinemessage-icon', props.icon],
    text: 'rs-inlinemessage-text'
};

export default BaseStyle.extend({
    name: 'inlinemessage',
    style,
    classes
});
