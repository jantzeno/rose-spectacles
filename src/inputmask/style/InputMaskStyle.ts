import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ instance }: StyleContext) => [
        'rs-inputmask',
        {
            'rs-filled': instance.$filled
        }
    ]
};

export default BaseStyle.extend({
    name: 'inputmask',
    classes
});
