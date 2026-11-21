/**
 *
 * When pressed, a floating action button can display multiple primary actions that can be performed on a page.
 *
 *
 * @module speeddialstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum SpeedDialClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-speeddial',
    /**
     * Class name of the button element
     */
    pcButton = 'rs-speeddial-button',
    /**
     * Class name of the list element
     */
    list = 'rs-speeddial-list',
    /**
     * Class name of the item element
     */
    item = 'rs-speeddial-item',
    /**
     * Class name of the action element
     */
    action = 'rs-speeddial-action',
    /**
     * Class name of the action icon element
     */
    actionIcon = 'rs-speeddial-action-icon',
    /**
     * Class name of the mask element
     */
    mask = 'rs-speeddial-mask'
}

export interface SpeedDialStyle extends BaseStyle {}

declare const style: SpeedDialStyle;
export default style;
