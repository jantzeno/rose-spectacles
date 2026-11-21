import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ instance }) => [
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
