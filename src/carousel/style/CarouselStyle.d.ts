/**
 *
 * Carousel is a content slider featuring various customization options.
 *
 *
 * @module carouselstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum CarouselClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-carousel',
    /**
     * Class name of the header element
     */
    header = 'rs-carousel-header',
    /**
     * Class name of the content container element
     */
    contentContainer = 'rs-carousel-content-container',
    /**
     * Class name of the content element
     */
    content = 'rs-carousel-content',
    /**
     * Class name of the previous button element
     */
    pcPrevButton = 'rs-carousel-prev-button',
    /**
     * Class name of the viewport element
     */
    viewport = 'rs-carousel-viewport',
    /**
     * Class name of the item list element
     */
    itemList = 'rs-carousel-item-list',
    /**
     * Class name of the item clone element
     */
    itemClone = 'rs-carousel-item-clone',
    /**
     * Class name of the item element
     */
    item = 'rs-carousel-item',
    /**
     * Class name of the next button element
     */
    pcNextButton = 'rs-carousel-next-button',
    /**
     * Class name of the indicator list element
     */
    indicatorList = 'rs-carousel-indicator-list',
    /**
     * Class name of the indicator element
     */
    indicator = 'rs-carousel-indicator',
    /**
     * Class name of the indicator button element
     */
    indicatorButton = 'rs-carousel-indicator-button',
    /**
     * Class name of the footer element
     */
    footer = 'rs-carousel-footer'
}

export interface CarouselStyle extends BaseStyle {}

declare const style: CarouselStyle;
export default style;
