import { style } from '../../internal/styles/splitbutton/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ instance, props }: StyleContext) => [
        'rs-splitbutton rs-component',
        {
            'rs-splitbutton-raised': props.raised,
            'rs-splitbutton-rounded': props.rounded,
            'rs-splitbutton-fluid': instance.hasFluid
        }
    ],
    pcButton: 'rs-splitbutton-button',
    pcDropdown: 'rs-splitbutton-dropdown'
};

export default BaseStyle.extend({
    name: 'splitbutton',
    style,
    classes
});
