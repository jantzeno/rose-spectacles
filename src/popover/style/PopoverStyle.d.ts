/**
 *
 * Popover is a container component positioned as connected to its target.
 *
 * [Live Demo](https://openvue.dev/popover)
 *
 * @module popoverstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum PopoverClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-popover',
    /**
     * Class name of the content element
     */
    content = 'rs-popover-content'
}

export interface PopoverStyle extends BaseStyle {}
