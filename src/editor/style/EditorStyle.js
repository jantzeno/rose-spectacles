import { style } from '../../internal/styles/editor/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ instance }) => [
        'rs-editor',
        {
            'rs-invalid': instance.$invalid
        }
    ],
    toolbar: 'rs-editor-toolbar',
    content: 'rs-editor-content'
};

export default BaseStyle.extend({
    name: 'editor',
    style,
    classes
});
