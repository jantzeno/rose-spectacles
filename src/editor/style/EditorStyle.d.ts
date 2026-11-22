/**
 *
 * Editor styles.
 *
 *
 * @module editorstyle
 *
 */
import type { BaseStyle } from 'rose-spectacles/core/base/style';

export enum EditorClasses {
    /**
     * Class name of the root element
     */
    root = 'rs-editor',
    /**
     * Class name of the toolbar element
     */
    toolbar = 'rs-editor-toolbar',
    formats = 'rs-editor-formats',
    /**
     * Class name of the content element
     */
    content = 'rs-editor-content'
}

export interface EditorStyle extends BaseStyle {}

declare const style: EditorStyle;
export default style;
