/**
 *
 * Column component defines various options to specify corresponding features.
 * It is a helper component for DataTable and TreeTable.
 *
 *
 * @module columnstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum ColumnClasses {}

export interface ColumnStyle extends BaseStyle {}

declare const style: ColumnStyle;
export default style;
