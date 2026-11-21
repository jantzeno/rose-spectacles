/**
 *
 * Displays an image with preview and tranformation options. For multiple image, see Galleria.
 *
 * [Live Demo](https://openvue.dev/image/)
 *
 * @module imagestyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum ImageClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-image',
    /**
     * Class name of the preview mask element
     */
    previewMask = 'rs-image-preview-mask',
    /**
     * Class name of the preview icon element
     */
    previewIcon = 'rs-image-preview-icon',
    /**
     * Class name of the mask element
     */
    mask = 'rs-image-mask',
    /**
     * Class name of the toolbar element
     */
    toolbar = 'rs-image-toolbar',
    /**
     * Class name of the rotate right button element
     */
    rotateRightButton = 'rs-image-rotate-right-button',
    /**
     * Class name of the rotate left button element
     */
    rotateLeftButton = 'rs-image-rotate-left-button',
    /**
     * Class name of the zoom out button element
     */
    zoomOutButton = 'rs-image-zoom-out-button',
    /**
     * Class name of the zoom in button element
     */
    zoomInButton = 'rs-image-zoom-in-button',
    /**
     * Class name of the close button element
     */
    closeButton = 'rs-image-close-button',
    /**
     * Class name of the original element
     */
    original = 'rs-image-original'
}

export interface ImageStyle extends BaseStyle {}

declare const style: ImageStyle;
export default style;
