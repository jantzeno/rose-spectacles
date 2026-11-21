import { style } from '../../internal/styles/image/index';
import BaseStyle, { type StyleContext } from '../../core/base/style/BaseStyle';

const classes = {
    root: ({ props }: StyleContext) => [
        'rs-image rs-component',
        {
            'rs-image-preview': props.preview
        }
    ],
    previewMask: 'rs-image-preview-mask',
    previewIcon: 'rs-image-preview-icon',
    mask: 'rs-image-mask rs-overlay-mask rs-overlay-mask-enter-active',
    toolbar: 'rs-image-toolbar',
    rotateRightButton: 'rs-image-action rs-image-rotate-right-button',
    rotateLeftButton: 'rs-image-action rs-image-rotate-left-button',
    zoomOutButton: ({ instance }: StyleContext) => [
        'rs-image-action rs-image-zoom-out-button',
        {
            'rs-disabled': instance.isZoomOutDisabled
        }
    ],
    zoomInButton: ({ instance }: StyleContext) => [
        'rs-image-action rs-image-zoom-in-button',
        {
            'rs-disabled': instance.isZoomInDisabled
        }
    ],
    closeButton: 'rs-image-action rs-image-close-button',
    original: 'rs-image-original'
};

export default BaseStyle.extend({
    name: 'image',
    style,
    classes
});
