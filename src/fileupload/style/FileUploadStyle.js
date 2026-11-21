import { style } from '../../internal/styles/fileupload/index';
import BaseStyle from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ props }) => [`rs-fileupload rs-fileupload-${props.mode} rs-component`],
    header: 'rs-fileupload-header',
    pcChooseButton: 'rs-fileupload-choose-button',
    pcUploadButton: 'rs-fileupload-upload-button',
    pcCancelButton: 'rs-fileupload-cancel-button',
    content: 'rs-fileupload-content',
    fileList: 'rs-fileupload-file-list',
    file: 'rs-fileupload-file',
    fileThumbnail: 'rs-fileupload-file-thumbnail',
    fileInfo: 'rs-fileupload-file-info',
    fileName: 'rs-fileupload-file-name',
    fileSize: 'rs-fileupload-file-size',
    pcFileBadge: 'rs-fileupload-file-badge',
    fileActions: 'rs-fileupload-file-actions',
    pcFileRemoveButton: 'rs-fileupload-file-remove-button',
    basicContent: 'rs-fileupload-basic-content'
};

export default BaseStyle.extend({
    name: 'fileupload',
    style,
    classes
});
