/**
 *
 * A set of Avatars can be displayed together using the AvatarGroup component.
 *
 *
 * @module avatargroupstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum AvatarGroupClasses {
    root = 'rs-avatar-group'
}

export interface AvatarGroupStyle extends BaseStyle {}

declare const style: AvatarGroupStyle;
export default style;
