/**
 *
 * DataView displays data in grid or list layout with pagination and sorting features.
 *
 * [Live Demo](https://openvue.dev/dataview/)
 *
 * @module dataviewstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum DataViewClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-dataview',
    /**
     * Class name of the header element
     */
    header = 'rs-dataview-header',
    /**
     * Class name of the paginator element
     */
    pcPaginator = 'rs-dataview-paginator-[position]',
    /**
     * Class name of the content element
     */
    content = 'rs-dataview-content',
    /**
     * Class name of the empty message element
     */
    emptyMessage = 'rs-dataview-empty-message', // TODO: remove?
    /**
     * Class name of the footer element
     */
    footer = 'rs-dataview-footer'
}

export interface DataViewStyle extends BaseStyle {}

declare const style: DataViewStyle;
export default style;
