/**
 *
 * Editor edits rich text with Tiptap.
 *
 *
 * @module editor
 *
 */
import type { DefineComponent, DesignToken, EmitFn, PassThrough } from 'rose-spectacles/core';
import type { PassThroughOptions } from 'rose-spectacles/passthrough';
import type { StyleValue, VNode } from 'vue';
import type { AnyExtension, Editor as TiptapEditor, EditorEvents } from '@tiptap/core';

import type {
    EditorPassThroughMethodOptions as PassThroughMethod,
    EditorPassThroughOptionType as PassThroughOption,
    EditorPassThroughOptions as PassThroughConfig
} from './EditorPassThrough';

export type { EditorPassThroughAttributes } from './EditorPassThrough';
export type EditorPassThroughOptionType = PassThroughOption<EditorProps>;
export type EditorPassThroughMethodOptions = PassThroughMethod<EditorProps>;
export type EditorPassThroughOptions = PassThroughConfig<EditorProps>;

export type EditorRange = { from: number; to: number };

/**
 * Custom text change event.
 * @see {@link EditorEmitsOptions['text-change']}
 */
export interface EditorTextChangeEvent {
    /**
     * Current value as html.
     */
    htmlValue: string;
    /**
     * Current value as text.
     */
    textValue: string;
    /**
     * Representation of the change.
     */
    transaction: EditorEvents['update']['transaction'];
    /**
     * Text editor instance.
     */
    instance: TiptapEditor;
}
/**
 * Custom selection change event.
 * @see {@link EditorEmitsOptions['selection-change']}
 */
export interface EditorSelectionChangeEvent {
    /**
     * Current value as html.
     */
    htmlValue: string;
    /**
     * Current value as text.
     */
    textValue: string;
    /**
     * Representation of the selection boundaries.
     */
    range: EditorRange | null;
    /**
     * Representation of the previous selection boundaries.
     */
    oldRange: EditorRange | null;
    /**
     * Text editor instance.
     */
    instance: TiptapEditor;
}
/**
 * Custom load event.
 * @see {@link EditorEmitsOptions.load}
 */
export interface EditorLoadEvent {
    /**
     * Text editor instance.
     */
    instance: TiptapEditor;
}

/**
 * Defines valid properties in Editor component.
 */
export interface EditorProps {
    /**
     * Value of the content.
     */
    modelValue?: string | null;
    /**
     * The default value for the input when not controlled by `modelValue`.
     */
    defaultValue?: string | null;
    /**
     * The name attribute for the element, typically used in form submissions.
     */
    name?: string | undefined;
    /**
     * Placeholder text to show when editor is empty.
     */
    placeholder?: string | undefined;
    /**
     * Whether to instantiate the editor to readonly mode.
     * @defaultValue false
     */
    readonly?: boolean | undefined;
    disabled?: boolean;
    /**
     * When present, it specifies that the component should have invalid state style.
     * @defaultValue false
     */
    invalid?: boolean | undefined;
    /**
     * Whitelist of built-in formatting options, such as header, bold, list, and link.
     */
    formats?: string[];
    /**
     * Inline style of the container.
     */
    editorStyle?: StyleValue;
    /**
     * Additional Tiptap extensions to load alongside the built-in extensions.
     */
    extensions?: AnyExtension[];
    /**
     * Form control object, typically used for handling validation and form state.
     */
    formControl?: Record<string, any> | undefined;
    /**
     * It generates scoped CSS variables using design tokens for the component.
     */
    dt?: DesignToken<any>;
    /**
     * Used to pass attributes to DOM elements inside the component.
     * @type {EditorPassThroughOptions}
     */
    pt?: PassThrough<EditorPassThroughOptions>;
    /**
     * Used to configure passthrough(pt) options of the component.
     * @type {PassThroughOptions}
     */
    ptOptions?: PassThroughOptions;
    /**
     * When enabled, it removes component related styles in the core.
     * @defaultValue false
     */
    unstyled?: boolean;
}

/**
 * Defines valid slots in Editor slots.
 */
export interface EditorSlots {
    /**
     * Custom toolbar template.
     */
    toolbar: (scope: { editor: TiptapEditor | null }) => VNode[];
}

/**
 * Defines valid emits in Editor component.
 */
export interface EditorEmitsOptions {
    /**
     * Emitted when the value changes.
     * @param {string} value - New value.
     */
    'update:modelValue'(value: string): void;
    /**
     * Emitted when the value changes in uncontrolled mode.
     * @param {string} value - New value.
     */
    'value-change'(value: string): void;
    /**
     * Callback to invoke when text of editor changes.
     * @param {EditorTextChangeEvent} event - Custom text change event.
     */
    'text-change'(event: EditorTextChangeEvent): void;
    /**
     * Callback to invoke when selection of the text changes.
     * @param {EditorSelectionChangeEvent} event - Custom selection change event.
     */
    'selection-change'(event: EditorSelectionChangeEvent): void;
    /**
     * Callback to invoke when the Tiptap instance is ready.
     * @param {EditorLoadEvent} event - Custom load event.
     */
    load(event: EditorLoadEvent): void;
}

export declare type EditorEmits = EmitFn<EditorEmitsOptions>;

/**
 * **Rose Spectacles - Editor**
 *
 * _Editor edits rich text with Tiptap._
 *
 *
 * @group Component
 *
 */
declare const Editor: DefineComponent<EditorProps, EditorSlots, EditorEmits>;

declare module 'vue' {
    export interface GlobalComponents {
        Editor: DefineComponent<EditorProps, EditorSlots, EditorEmits>;
    }
}

export default Editor;
