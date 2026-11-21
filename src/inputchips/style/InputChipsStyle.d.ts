/**
 *
 * InputChips groups a collection of contents in tabs.
 *
 * [Live Demo](https://openvue.dev/inputchips/)
 *
 * @module inputchipsstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum InputChipsClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-inputchips',
    /**
     * Class name of the input element
     */
    input = 'rs-inputchips-input',
    /**
     * Class name of the chip item element
     */
    chipItem = 'rs-inputchips-chip-item',
    /**
     * Class name of the chip element
     */
    pcChip = 'rs-inputchips-chip-label',
    /**
     * Class name of the chip icon element
     */
    chipIcon = 'rs-inputchips-chip-icon',
    /**
     * Class name of the input item element
     */
    inputItem = 'rs-inputchips-input-item'
}

export interface InputChipsStyle extends BaseStyle {}
