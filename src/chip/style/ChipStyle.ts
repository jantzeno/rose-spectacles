import { style } from '../../internal/styles/chip/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: 'rs-chip rs-component',
    image: 'rs-chip-image',
    icon: 'rs-chip-icon',
    label: 'rs-chip-label',
    removeButton: 'rs-chip-remove-button',
    removeIcon: 'rs-chip-remove-icon'
};

export default BaseStyle.extend({
    name: 'chip',
    style,
    classes
});
