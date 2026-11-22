import { Area } from '@unovis/ts/components/area';
import { Axis } from '@unovis/ts/components/axis';
import { Donut } from '@unovis/ts/components/donut';
import { GroupedBar } from '@unovis/ts/components/grouped-bar';
import { Line } from '@unovis/ts/components/line';
import { Scatter } from '@unovis/ts/components/scatter';
import { StackedBar } from '@unovis/ts/components/stacked-bar';
import { Tooltip } from '@unovis/ts/components/tooltip';
import { SingleContainer } from '@unovis/ts/containers/single-container';
import { XYContainer } from '@unovis/ts/containers/xy-container';
import {
    chartColor,
    chartRows,
    themedColor,
    type ChartColor,
    type ChartData,
    type ChartOptions,
    type ChartRow,
    type ChartSelection,
    type ChartType
} from './model';

export type ChartInstance = XYContainer<ChartRow> | SingleContainer<ChartRow[]>;

export interface ChartConfig {
    type: ChartType;
    data: ChartData;
    options: ChartOptions;
    width: number;
    height: number;
    themed: boolean;
}

export function createChart(host: HTMLElement, read: () => ChartConfig, onSelect: (event: ChartSelection) => void) {
    const initial = read();
    const { type } = initial;
    const circular = type === 'pie' || type === 'doughnut';
    let chart: ChartInstance;
    let disposeComponents: (() => void) | undefined;

    function color(value: ChartColor | undefined, colorIndex: number, seriesIndex: number) {
        return chartColor(value, colorIndex) ?? (read().themed ? themedColor(seriesIndex) : undefined);
    }

    function select(row: ChartRow, datasetIndex: number, event: MouseEvent) {
        const dataset = read().data.datasets[datasetIndex];
        const index = row.points[datasetIndex]?.index;
        const element = event.currentTarget;
        if (index === undefined || !dataset || !(element instanceof SVGElement || element instanceof HTMLElement)) return;
        onSelect({ originalEvent: event, element, dataset, datasetIndex, index, point: dataset.data[index] });
    }

    function configure() {
        const { data, options, width, height } = read();
        const { rows, labels } = chartRows(data, type);
        const duration = options.animation === false ? 0 : typeof options.animation === 'object' ? options.animation.duration : undefined;
        const size = { width: options.responsive === false ? width : undefined, height, duration };
        const withTooltip = options.tooltip !== false && options.plugins?.tooltip?.enabled !== false;
        disposeComponents?.();

        function describe(row: ChartRow) {
            const content = document.createElement('span');
            const values = (circular ? data.datasets.slice(0, 1) : data.datasets).flatMap((series, index) => {
                const value = row.points[index]?.y;
                return value == null ? [] : [series.label ? `${series.label}: ${value}` : String(value)];
            });
            content.textContent = [row.label, ...values].join(' · ');
            return content;
        }

        if (circular) {
            const donut = new Donut<ChartRow>({
                duration,
                value: (row) => Math.max(0, row.points[0]?.y ?? 0),
                color: (row, index) => color(data.datasets[0]?.backgroundColor, row.points[0]?.index ?? index, index),
                arcWidth: type === 'pie' ? 0 : (options.arcWidth ?? Math.min(width, height) / 4),
                padAngle: 0,
                showBackground: false,
                attributes: { [Donut.selectors.segment]: { 'data-rs-chart-mark': 'slice' } },
                events: { [Donut.selectors.segment]: { click: (arc: { data: ChartRow }, event: MouseEvent) => select(arc.data, 0, event) } }
            });
            const tooltip = withTooltip ? new Tooltip({ triggers: { [Donut.selectors.segment]: (arc: { data: ChartRow }) => describe(arc.data) } }) : undefined;
            const config = { ...size, component: donut, tooltip };
            const slices = rows.filter((row) => row.points[0]);
            if (chart) (chart as SingleContainer<ChartRow[]>).update(config, undefined, slices);
            else chart = new SingleContainer(host, config, slices);
            disposeComponents = () => {
                tooltip?.destroy();
                donut.destroy();
            };
            return;
        }

        const horizontal = options.indexAxis === 'y';
        const present = data.datasets.map((dataset, index) => ({ dataset, index, type: dataset.type ?? type }));
        const bars = present.filter((series) => series.type === 'bar');
        const components = present.flatMap(({ dataset, index, type }): Array<Line<ChartRow> | Area<ChartRow> | Scatter<ChartRow>> => {
            const x = (row: ChartRow) => row.x;
            const y = (row: ChartRow) => row.points[index]?.y;
            const fill = (row: ChartRow) => color(dataset.backgroundColor ?? dataset.borderColor, row.points[index]?.index ?? 0, index);
            const events = { [Scatter.selectors.point]: { click: (row: ChartRow, event: MouseEvent) => select(row, index, event) } };
            if (type === 'scatter' || type === 'bubble') {
                return [
                    new Scatter({
                        x,
                        y,
                        duration,
                        color: fill,
                        size: (row) => (type === 'bubble' ? 2 * (row.points[index]?.radius ?? 4) : 2 * (dataset.pointRadius ?? 4)),
                        events
                    })
                ];
            }
            if (type !== 'line') return [];

            const stroke = color(dataset.borderColor ?? dataset.backgroundColor, 0, index);
            const line = new Line({ x, y, duration, color: stroke, fallbackValue: null, lineWidth: dataset.borderWidth });
            const layers: Array<Line<ChartRow> | Area<ChartRow> | Scatter<ChartRow>> = [];
            if (dataset.fill) layers.push(new Area({ x, y, duration, color: color(dataset.backgroundColor ?? dataset.borderColor, 0, index) }));
            layers.push(line);
            if (dataset.pointRadius !== 0) layers.push(new Scatter({ x, y, duration, color: fill, size: 2 * (dataset.pointRadius ?? 3), events }));
            return layers;
        });
        const stacked = options.stacked ?? (options.scales?.x?.stacked || options.scales?.y?.stacked);
        const barClass = stacked ? StackedBar : GroupedBar;
        const bar = bars.length
            ? new barClass<ChartRow>({
                  x: (row) => row.x,
                  y: bars.map(
                      ({ index }) =>
                          (row: ChartRow) =>
                              row.points[index]?.y
                  ),
                  duration,
                  color: (row, series) =>
                      color(bars[series]?.dataset.backgroundColor, row.points[bars[series]?.index]?.index ?? 0, bars[series]?.index ?? series),
                  orientation: horizontal ? 'horizontal' : 'vertical',
                  barMinHeight: 0,
                  attributes: { [barClass.selectors.bar]: { 'data-rs-chart-mark': 'bar' } },
                  events: {
                      [barClass.selectors.bar]: {
                          click: (row: ChartRow & { stackIndex?: number }, event: MouseEvent) => {
                              const element = event.currentTarget as Element;
                              const siblings = Array.from(element.parentElement?.children ?? []).filter((item) =>
                                  item.classList.contains(barClass.selectors.bar)
                              );
                              const series = bars[row.stackIndex ?? siblings.indexOf(element)];
                              if (series) select(row, series.index, event);
                          }
                      }
                  }
              })
            : undefined;

        const categoryAxis = labels.size ? { tickValues: [...labels.keys()], tickFormat: (tick: number | Date) => labels.get(Number(tick)) ?? '' } : {};
        const legacyAxis = (axis: 'x' | 'y') => {
            const scale = options.scales?.[axis];
            return {
                gridLine: scale?.grid?.display ?? (axis === 'y' ? !horizontal : horizontal),
                label: scale?.title?.display === false ? undefined : scale?.title?.text
            };
        };
        const xAxis =
            options.xAxis === false || (options.xAxis === undefined && options.scales?.x?.display === false)
                ? undefined
                : new Axis<ChartRow>({ type: 'x', ...legacyAxis('x'), ...(!horizontal ? categoryAxis : {}), ...options.xAxis });
        const yAxis =
            options.yAxis === false || (options.yAxis === undefined && options.scales?.y?.display === false)
                ? undefined
                : new Axis<ChartRow>({ type: 'y', ...legacyAxis('y'), ...(horizontal ? categoryAxis : {}), ...options.yAxis });
        const layers = bar ? [bar, ...components] : components;
        const tooltip = withTooltip
            ? new Tooltip({
                  triggers: {
                      [Scatter.selectors.point]: describe,
                      [GroupedBar.selectors.bar]: describe,
                      [StackedBar.selectors.bar]: (bar: { datum: ChartRow }) => describe(bar.datum)
                  }
              })
            : undefined;
        const domain = (axis: 'x' | 'y'): [number | undefined, number | undefined] | undefined => {
            const { min, max } = options.scales?.[axis] ?? {};
            return min !== undefined || max !== undefined ? [min, max] : undefined;
        };
        const config = { ...size, xAxis, yAxis, xDomain: options.xDomain ?? domain('x'), yDomain: options.yDomain ?? domain('y'), components: layers, tooltip };
        if (chart) (chart as XYContainer<ChartRow>).update(config, undefined, rows);
        else chart = new XYContainer(host, config, rows);
        disposeComponents = () => {
            tooltip?.destroy();
            layers.forEach((layer) => layer.destroy());
            xAxis?.destroy();
            yAxis?.destroy();
        };
    }

    configure();

    return {
        get chart() {
            return chart;
        },
        update: configure,
        destroy: () => chart.destroy()
    };
}
