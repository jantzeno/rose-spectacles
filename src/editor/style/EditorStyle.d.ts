/**
 *
 * Editor groups a collection of contents in tabs.
 *
 * [Live Demo](https://openvue.dev/editor/)
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
    /**
     * Class name of the content element
     */
    content = 'rs-editor-content'
}

export interface EditorStyle extends BaseStyle {}
