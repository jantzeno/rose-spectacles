/**
 *
 * Chart is a wrapper around Chart.js, rendering data driven charts on a canvas element.
 *
 * [Live Demo](https://openvue.dev/chart/)
 *
 * @module chart
 *
 */
import type { ChartData, ChartOptions, ChartType, Plugin } from 'chart.js';
import type { DefineComponent, DesignToken, EmitFn, PassThrough } from 'rose-spectacles/core';
import type { PassThroughOptions } from 'rose-spectacles/passthrough';
import { CanvasHTMLAttributes } from 'vue';

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
export interface ChartSelectEvent {
    /**
     * Browser event.
     */
    originalEvent: Event;
    /**
     * Selected element.
     */
    element: HTMLElement | any;
    /**
     * Selected dataset.
     */
    dataset: any;
}

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
    options?: ChartOptions<TType> | undefined;
    /**
     * Used to custom plugins of the chart.
     */
    plugins?: Plugin<TType>[];
    /**
     * Width of the chart in non-responsive mode.
     * @defaultValue 300
     */
    width?: number | undefined;
    /**
     * Height of the chart in non-responsive mode.
     * @defaultValue 150
     */
    height?: number | undefined;
    /**
     * Used to pass all properties of the CanvasHTMLAttributes to canvas element inside the component.
     */
    canvasProps?: CanvasHTMLAttributes | undefined;
    /**
     * When enabled, colors, fonts and grid lines are derived from the active theme's design tokens
     * and kept in sync with theme changes. Any option passed via the options property takes precedence.
     * @defaultValue true
     */
    themed?: boolean | undefined;
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
     * @param {*} chart - Chart instance.
     */
    loaded(chart: any): void;
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
    /**
     * Returns the canvas element the chart is rendered on.
     *
     * @memberof Chart
     */
    getCanvas(): HTMLCanvasElement | undefined;
    /**
     * Returns a base64 encoded png image of the chart.
     *
     * @memberof Chart
     */
    getBase64Image(): string;
    /**
     * Returns Chart instance.
     *
     * @memberof Chart
     */
    getChart(): any;
}

/**
 * **OpenVue - Chart**
 *
 * _Chart is a wrapper around Chart.js, rendering data driven charts on a canvas element._
 *
 * [Live Demo](https://openvue.dev/chart/)
 * --- ---
 * ![Rose Spectacles](https://primefaces.org/cdn/primevue/images/logo-100.png)
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
