/**
 *
 * Columns can be grouped at header and footer sections by defining a ColumnGroup component.
 * It is a helper component for DataTable.
 *
 *
 * @module columngroupstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum ColumnGroupClasses {}

export interface ColumnGroupStyle extends BaseStyle {}

declare const style: ColumnGroupStyle;
export default style;
