import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ instance }: StyleContext) => [
        'rs-step',
        {
            'rs-step-active': instance.active,
            'rs-disabled': instance.isStepDisabled
        }
    ],
    header: 'rs-step-header',
    number: 'rs-step-number',
    title: 'rs-step-title'
};

export default BaseStyle.extend({
    name: 'step',
    classes
});
