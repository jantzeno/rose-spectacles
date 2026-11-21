import { style } from '../../internal/styles/metergroup/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ props }: StyleContext) => [
        'rs-metergroup rs-component',
        {
            'rs-metergroup-horizontal': props.orientation === 'horizontal',
            'rs-metergroup-vertical': props.orientation === 'vertical'
        }
    ],
    meters: 'rs-metergroup-meters',
    meter: 'rs-metergroup-meter',
    labelList: ({ props }: StyleContext) => [
        'rs-metergroup-label-list',
        {
            'rs-metergroup-label-list-vertical': props.labelOrientation === 'vertical',
            'rs-metergroup-label-list-horizontal': props.labelOrientation === 'horizontal'
        }
    ],
    label: 'rs-metergroup-label',
    labelIcon: 'rs-metergroup-label-icon',
    labelMarker: 'rs-metergroup-label-marker',
    labelText: 'rs-metergroup-label-text'
};

export default BaseStyle.extend({
    name: 'metergroup',
    style,
    classes
});
