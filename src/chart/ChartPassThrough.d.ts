import type { ComponentHooks } from 'rose-spectacles/core/basecomponent';

export declare type ChartPassThroughOptionType<P> =
    | ChartPassThroughAttributes
    | ((options: ChartPassThroughMethodOptions<P>) => ChartPassThroughAttributes | string)
    | string
    | null
    | undefined;

/**
 * Custom passthrough(pt) option method.
 */
export interface ChartPassThroughMethodOptions<P> {
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
export interface ChartPassThroughOptions<P = Record<string, unknown>> {
    /**
     * Used to pass attributes to the root's DOM element.
     */
    root?: ChartPassThroughOptionType<P>;
    /**
     * Used to pass attributes to the canvas's DOM element.
     */
    canvas?: ChartPassThroughOptionType<P>;
    /**
     * Used to manage all lifecycle hooks.
     * @see {@link BaseComponent.ComponentHooks}
     */
    hooks?: ComponentHooks;
}

/**
 * Custom passthrough attributes for each DOM elements
 */
export interface ChartPassThroughAttributes {
    [key: string]: any;
}
