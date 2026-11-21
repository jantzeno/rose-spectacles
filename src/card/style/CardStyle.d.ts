/**
 *
 * Card is a flexible container component.
 *
 *
 * @module cardstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum CardClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-card',
    /**
     * Class name of the header element
     */
    header = 'rs-card-header',
    /**
     * Class name of the body element
     */
    body = 'rs-card-body',
    /**
     * Class name of the caption element
     */
    caption = 'rs-card-caption',
    /**
     * Class name of the title element
     */
    title = 'rs-card-title',
    /**
     * Class name of the subtitle element
     */
    subtitle = 'rs-card-subtitle',
    /**
     * Class name of the content element
     */
    content = 'rs-card-content',
    /**
     * Class name of the footer element
     */
    footer = 'rs-card-footer'
}

export interface CardStyle extends BaseStyle {}

declare const style: CardStyle;
export default style;
