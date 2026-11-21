/**
 *
 * FileUpload is an advanced uploader with dragdrop support, multi file uploads, auto uploading, progress tracking and validations.
 *
 *
 * @module fileuploadstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum FileUploadClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-fileupload',
    /**
     * Class name of the header element
     */
    header = 'rs-fileupload-header',
    /**
     * Class name of the choose button element
     */
    pcChooseButton = 'rs-fileupload-choose-button',
    /**
     * Class name of the upload button element
     */
    pcUploadButton = 'rs-fileupload-upload-button',
    /**
     * Class name of the cancel button element
     */
    pcCancelButton = 'rs-fileupload-cancel-button',
    /**
     * Class name of the content element
     */
    content = 'rs-fileupload-content',
    /**
     * Class name of the file list element
     */
    fileList = 'rs-fileupload-file-list',
    /**
     * Class name of the file element
     */
    file = 'rs-fileupload-file',
    /**
     * Class name of the file thumbnail element
     */
    fileThumbnail = 'rs-fileupload-file-thumbnail',
    /**
     * Class name of the file info element
     */
    fileInfo = 'rs-fileupload-file-info',
    /**
     * Class name of the file name element
     */
    fileName = 'rs-fileupload-file-name',
    /**
     * Class name of the file size element
     */
    fileSize = 'rs-fileupload-file-size',
    /**
     * Class name of the file badge element
     */
    pcFileBadge = 'rs-fileupload-file-badge',
    /**
     * Class name of the file actions element
     */
    fileActions = 'rs-fileupload-file-actions',
    /**
     * Class name of the file remove button element
     */
    pcFileRemoveButton = 'rs-fileupload-file-remove-button',
    /**
     * Class name of the content element in basic mode
     */
    basicContent = 'rs-fileupload-basic-content'
}

export interface FileUploadStyle extends BaseStyle {}

declare const style: FileUploadStyle;
export default style;
