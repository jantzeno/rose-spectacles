/**
 *
 * MeterGroup is a group of process status indicators.
 *
 * [Live Demo](https://openvue.dev/metergroup)
 *
 * @module metergroupstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum MeterGroupClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-metergroup',
    /**
     * Class name of the meters element
     */
    meters = 'rs-metergroup-meters',
    /**
     * Class name of the meter element
     */
    meter = 'rs-metergroup-meter',
    /**
     * Class name of the label list element
     */
    labelList = 'rs-metergroup-label-list',
    /**
     * Class name of the label element
     */
    label = 'rs-metergroup-label',
    /**
     * Class name of the label icon element
     */
    labelIcon = 'rs-metergroup-label-icon',
    /**
     * Class name of the label marker element
     */
    labelMarker = 'rs-metergroup-label-marker',
    /**
     * Class name of the label text element
     */
    labelText = 'rs-metergroup-label-text'
}

export interface MeterGroupStyle extends BaseStyle {}
