import { style } from '../../internal/styles/fieldset/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ props }) => [
        'rs-fieldset rs-component',
        {
            'rs-fieldset-toggleable': props.toggleable
        }
    ],
    legend: 'rs-fieldset-legend',
    legendLabel: 'rs-fieldset-legend-label',
    toggleButton: 'rs-fieldset-toggle-button',
    toggleIcon: 'rs-fieldset-toggle-icon',
    contentContainer: 'rs-fieldset-content-container',
    contentWrapper: 'rs-fieldset-content-wrapper',
    content: 'rs-fieldset-content'
};

export default BaseStyle.extend({
    name: 'fieldset',
    style,
    classes
});
