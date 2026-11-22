import type { ComponentHooks } from 'rose-spectacles/core/basecomponent';

export declare type EditorPassThroughOptionType<P> =
    | EditorPassThroughAttributes
    | ((options: EditorPassThroughMethodOptions<P>) => EditorPassThroughAttributes | string)
    | string
    | null
    | undefined;

/**
 * Custom passthrough(pt) option method.
 */
export interface EditorPassThroughMethodOptions<P> {
    /**
     * Defines instance.
     */
    instance: any;
    /**
     * Defines valid properties.
     */
    props: P;
    /**
     * Defines valid attributes.
     */
    attrs: any;
    /**
     * Defines parent options.
     */
    parent: any;
    /**
     * Defines passthrough(pt) options in global config.
     */
    global: object | undefined;
}

/**
 * Custom passthrough(pt) options.
 */
export interface EditorPassThroughOptions<P = Record<string, unknown>> {
    /**
     * Used to pass attributes to the root's DOM element.
     */
    root?: EditorPassThroughOptionType<P>;
    /**
     * Used to pass attributes to the toolbar's DOM element.
     */
    toolbar?: EditorPassThroughOptionType<P>;
    /**
     * Used to pass attributes to the formats' DOM element.
     */
    formats?: EditorPassThroughOptionType<P>;
    /**
     * Used to pass attributes to the header's DOM element.
     */
    header?: EditorPassThroughOptionType<P>;
    /**
     * Used to pass attributes to the option's DOM element.
     */
    option?: EditorPassThroughOptionType<P>;
    /**
     * Used to pass attributes to the bold's DOM element.
     */
    bold?: EditorPassThroughOptionType<P>;
    /**
     * Used to pass attributes to the italic's DOM element.
     */
    italic?: EditorPassThroughOptionType<P>;
    /**
     * Used to pass attributes to the underline's DOM element.
     */
    underline?: EditorPassThroughOptionType<P>;
    /**
     * Used to pass attributes to the color's DOM element.
     */
    color?: EditorPassThroughOptionType<P>;
    /**
     * Used to pass attributes to the background's DOM element.
     */
    background?: EditorPassThroughOptionType<P>;
    /**
     * Used to pass attributes to the list's DOM element.
     */
    list?: EditorPassThroughOptionType<P>;
    /**
     * Used to pass attributes to the select's DOM element.
     */
    select?: EditorPassThroughOptionType<P>;
    /**
     * Used to pass attributes to the link's DOM element.
     */
    link?: EditorPassThroughOptionType<P>;
    /**
     * Used to pass attributes to the image's DOM element.
     */
    image?: EditorPassThroughOptionType<P>;
    /**
     * Used to pass attributes to the code block's DOM element.
     */
    codeBlock?: EditorPassThroughOptionType<P>;
    /**
     * Used to pass attributes to the clean's DOM element.
     */
    clean?: EditorPassThroughOptionType<P>;
    /**
     * Used to pass attributes to the content's DOM element.
     */
    content?: EditorPassThroughOptionType<P>;
    /**
     * Used to manage all lifecycle hooks.
     * @see {@link BaseComponent.ComponentHooks}
     */
    hooks?: ComponentHooks;
}

/**
 * Custom passthrough attributes for each DOM elements
 */
export interface EditorPassThroughAttributes {
    [key: string]: any;
}
