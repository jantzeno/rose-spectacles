import quillStyles from 'quill/dist/quill.snow.css?inline';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ instance }: StyleContext) => [
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
    style: quillStyles,
    classes
});
