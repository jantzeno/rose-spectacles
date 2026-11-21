/**
 *
 * Galleria is an advanced content gallery component.
 *
 *
 * @module galleriastyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum GalleriaClasses {
    /**
     * Class name of the mask element
     */
    mask = 'rs-galleria-mask',
    /**
     * Class name of the root element
     */
    root = 'rs-galleria',
    /**
     * Class name of the close button element
     */
    closeButton = 'rs-galleria-close-button',
    /**
     * Class name of the close icon element
     */
    closeIcon = 'rs-galleria-close-icon',
    /**
     * Class name of the header element
     */
    header = 'rs-galleria-header',
    /**
     * Class name of the content element
     */
    content = 'rs-galleria-content',
    /**
     * Class name of the footer element
     */
    footer = 'rs-galleria-footer',
    /**
     * Class name of the items container element
     */
    itemsContainer = 'rs-galleria-items-container',
    /**
     * Class name of the items element
     */
    items = 'rs-galleria-items',
    /**
     * Class name of the previous item button element
     */
    prevButton = 'rs-galleria-prev-button',
    /**
     * Class name of the previous item icon element
     */
    prevIcon = 'rs-galleria-prev-icon',
    /**
     * Class name of the item element
     */
    item = 'rs-galleria-item',
    /**
     * Class name of the next item button element
     */
    nextButton = 'rs-galleria-next-button',
    /**
     * Class name of the next item icon element
     */
    nextIcon = 'rs-galleria-next-icon',
    /**
     * Class name of the caption element
     */
    caption = 'rs-galleria-caption',
    /**
     * Class name of the indicator list element
     */
    indicatorList = 'rs-galleria-indicator-list',
    /**
     * Class name of the indicator element
     */
    indicator = 'rs-galleria-indicator',
    /**
     * Class name of the indicator button element
     */
    indicatorButton = 'rs-galleria-indicator-button',
    /**
     * Class name of the thumbnails element
     */
    thumbnails = 'rs-galleria-thumbnails',
    /**
     * Class name of the thumbnail content element
     */
    thumbnailContent = 'rs-galleria-thumbnails-content',
    /**
     * Class name of the previous thumbnail button element
     */
    previousThumbnailButton = 'rs-galleria-thumbnail-prev-button',
    /**
     * Class name of the previous thumbnail icon element
     */
    previousThumbnailIcon = 'rs-galleria-thumbnail-prev-icon',
    /**
     * Class name of the thumbnails viewport element
     */
    thumbnailsViewport = 'rs-galleria-thumbnails-viewport',
    /**
     * Class name of the thumbnail items element
     */
    thumbnailItems = 'rs-galleria-thumbnail-items',
    /**
     * Class name of the thumbnail item element
     */
    thumbnailItem = 'rs-galleria-thumbnail-item',
    /**
     * Class name of the thumbnail element
     */
    thumbnail = 'rs-galleria-thumbnail',
    /**
     * Class name of the next thumbnail button element
     */
    nextThumbnailButton = 'rs-galleria-thumbnail-next-button',
    /**
     * Class name of the next thumbnail icon element
     */
    nextThumbnailIcon = 'rs-galleria-thumbnail-next-icon'
}

export interface GalleriaStyle extends BaseStyle {}

declare const style: GalleriaStyle;
export default style;
