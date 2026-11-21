/**
 *
 * Avatar represents people using icons, labels and images.
 *
 * - [Live Demo](https://openvue.dev/avatar)
 *
 * @module avatarstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum AvatarClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-avatar',
    /**
     * Class name of the label element
     */
    label = 'rs-avatar-label',
    /**
     * Class name of the icon element
     */
    icon = 'rs-avatar-icon'
}

export interface AvatarStyle extends BaseStyle {}
