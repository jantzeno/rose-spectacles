/**
 *
 * OrderList is used to managed the order of a collection.
 *
 *
 * @module orderliststyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum OrderListClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-orderlist',
    /**
     * Class name of the controls element
     */
    controls = 'rs-orderlist-controls'
}

export interface OrderListStyle extends BaseStyle {}

declare const style: OrderListStyle;
export default style;
