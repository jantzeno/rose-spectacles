/**
 *
 * Sidebar is a panel component displayed as an overlay at the edges of the screen.
 *
 *
 * @module sidebarstyle
 *
 */
import type { DrawerStyle } from 'rose-spectacles/drawer/style';

export enum SidebarClasses {}

export interface SidebarStyle extends DrawerStyle {}

declare const style: SidebarStyle;
export default style;
