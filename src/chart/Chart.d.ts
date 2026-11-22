/**
 *
 * Chart renders data-driven SVG charts with Unovis.
 *
 *
 * @module chart
 *
 */
import type { ChartData, ChartOptions, ChartSelection, ChartType } from './model';
import type { ChartInstance } from './render';

export type { ChartData, ChartDataset, ChartOptions, ChartPoint, ChartType } from './model';
export type { ChartInstance } from './render';
import type { DefineComponent, DesignToken, EmitFn, PassThrough } from 'rose-spectacles/core';
import type { PassThroughOptions } from 'rose-spectacles/passthrough';
import type { HTMLAttributes } from 'vue';

import type {
    ChartPassThroughMethodOptions as PassThroughMethod,
    ChartPassThroughOptions as PassThroughConfig,
    ChartPassThroughOptionType as PassThroughOption
} from './ChartPassThrough';

export type { ChartPassThroughAttributes } from './ChartPassThrough';
export type ChartPassThroughOptionType = PassThroughOption<ChartProps>;
export type ChartPassThroughMethodOptions = PassThroughMethod<ChartProps>;
export type ChartPassThroughOptions = PassThroughConfig<ChartProps>;

/**
 * Custom select event.
 * @see {@link ChartEmitsOptions.select}
 */
export type ChartSelectEvent = ChartSelection;

/**
 * Defines valid properties in Chart component.
 */
export interface ChartProps<TType extends ChartType = ChartType> {
    /**
     * Type of the chart.
     */
    type?: TType | undefined;
    /**
     * Data to display.
     */
    data?: ChartData<TType> | undefined;
    /**
     * Options to customize the chart.
     */
    options?: ChartOptions | undefined;
    /** Width of the plot when responsiveness is disabled. Defaults to 300. */
    width?: number;
    /** Height of the plot in pixels. Defaults to 150. */
    height?: number;
    /** HTML attributes for the element that contains the SVG plot. */
    containerProps?: HTMLAttributes;
    /** @deprecated Use containerProps for attributes on the SVG plot host. */
    canvasProps?: HTMLAttributes;
    /** Use Rose Spectacles CSS tokens for default chart colors. Defaults to true. */
    themed?: boolean;
    /**
     * It generates scoped CSS variables using design tokens for the component.
     */
    dt?: DesignToken<any>;
    /**
     * Used to pass attributes to DOM elements inside the component.
     * @type {ChartPassThroughOptions}
     */
    pt?: PassThrough<ChartPassThroughOptions>;
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

export interface ChartSlots {}

/**
 * Defines valid emits in Chart component.
 */
export interface ChartEmitsOptions {
    /**
     * Callback to invoke when a data element of the chart is clicked.
     * @param {ChartSelectEvent} event - Custom select event.
     */
    select(event: ChartSelectEvent): void;
    /**
     * Callback to invoke when chart is loaded.
     * @param {ChartInstance} chart - Unovis container.
     */
    loaded(chart: ChartInstance): void;
}

export declare type ChartEmits = EmitFn<ChartEmitsOptions>;

export interface ChartMethods {
    /**
     * Redraws the graph.
     *
     * @memberof Chart
     */
    refresh(): void;
    /**
     * Destroys the graph first and then creates it again.
     *
     * @memberof Chart
     */
    reinit(): void;
    /** Returns the rendered SVG markup, or an empty string until the chart loads. */
    getSVG(): string;
    /** Returns a base64-encoded SVG data URL, or an empty string until the chart loads. */
    getBase64Image(): string;
    /** Returns the underlying Unovis container. */
    getChart(): ChartInstance | null;
}

/**
 * **OpenVue - Chart**
 *
 * _Chart renders data-driven SVG charts with Unovis._
 *
 *
 * @group Component
 *
 */
declare const Chart: DefineComponent<ChartProps, ChartSlots, ChartEmits, ChartMethods>;

declare module 'vue' {
    export interface GlobalComponents {
        Chart: DefineComponent<ChartProps, ChartSlots, ChartEmits, ChartMethods>;
    }
}

export default Chart;
