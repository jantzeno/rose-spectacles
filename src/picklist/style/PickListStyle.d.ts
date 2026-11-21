/**
 *
 * PickList is used to reorder items between different lists.
 *
 * [Live Demo](https://openvue.dev/picklist)
 *
 * @module pickliststyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum PickListClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-picklist',
    /**
     * Class name of the source controls element
     */
    sourceControls = 'rs-picklist-source-controls',
    /**
     * Class name of the source list container element
     */
    sourceListContainer = 'rs-picklist-source-list-container',
    /**
     * Class name of the transfer controls element
     */
    transferControls = 'rs-picklist-transfer-controls',
    /**
     * Class name of the target list container element
     */
    targetListContainer = 'rs-picklist-target-list-container',
    /**
     * Class name of the target controls element
     */
    targetControls = 'rs-picklist-target-controls'
}

export interface PickListStyle extends BaseStyle {}

declare const style: PickListStyle;
export default style;
