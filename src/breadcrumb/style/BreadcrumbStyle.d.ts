/**
 *
 * Breadcrumb provides contextual information about page hierarchy.
 *
 *
 * @module breadcrumbstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum BreadcrumbClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-breadcrumb',
    /**
     * Class name of the list element
     */
    list = 'rs-breadcrumb-list',
    /**
     * Class name of the home item element
     */
    homeItem = 'rs-breadcrumb-home-item',
    /**
     * Class name of the separator element
     */
    separator = 'rs-breadcrumb-separator',
    /**
     * Class name of the separator icon element
     */
    separatorIcon = 'rs-breadcrumb-separator-icon',
    /**
     * Class name of the item element
     */
    item = 'rs-breadcrumb-item',
    /**
     * Class name of the item link element
     */
    itemLink = 'rs-breadcrumb-item-link',
    /**
     * Class name of the item icon element
     */
    itemIcon = 'rs-breadcrumb-item-icon',
    /**
     * Class name of the item label element
     */
    itemLabel = 'rs-breadcrumb-item-label'
}

export interface BreadcrumbStyle extends BaseStyle {}

declare const style: BreadcrumbStyle;
export default style;
