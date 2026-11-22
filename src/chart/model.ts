import type { AxisConfigInterface } from '@unovis/ts/components/axis/config';

export type ChartType = 'bar' | 'line' | 'scatter' | 'bubble' | 'pie' | 'doughnut';
export type ChartPoint = number | null | { x: number | string | Date; y: number | null; r?: number } | [number | string | Date, number | null];
export type ChartColor = string | string[];

export interface ChartDataset<T extends ChartType = ChartType> {
    label?: string;
    type?: T;
    data: ChartPoint[];
    backgroundColor?: ChartColor;
    borderColor?: ChartColor;
    borderWidth?: number;
    fill?: boolean;
    pointRadius?: number;
}

export interface ChartData<T extends ChartType = ChartType> {
    labels?: Array<string | number>;
    datasets: ChartDataset<T>[];
}

export interface ChartOptions {
    responsive?: boolean;
    animation?: boolean | { duration?: number };
    indexAxis?: 'x' | 'y';
    stacked?: boolean;
    xDomain?: [number | undefined, number | undefined];
    yDomain?: [number | undefined, number | undefined];
    xAxis?: false | Omit<AxisConfigInterface<ChartRow>, 'type'>;
    yAxis?: false | Omit<AxisConfigInterface<ChartRow>, 'type'>;
    arcWidth?: number;
    legend?: boolean;
    tooltip?: boolean;
    scales?: { x?: ChartScaleOptions; y?: ChartScaleOptions };
    plugins?: { legend?: { display?: boolean }; tooltip?: { enabled?: boolean } };
}

interface ChartScaleOptions {
    display?: boolean;
    stacked?: boolean;
    min?: number;
    max?: number;
    grid?: { display?: boolean };
    title?: { display?: boolean; text?: string };
}

export interface ChartRow {
    x: number;
    label: string;
    points: Array<{ y: number | null; index: number; radius?: number } | undefined>;
}

export interface ChartSelection {
    originalEvent: MouseEvent;
    element: SVGElement | HTMLElement;
    dataset: ChartDataset;
    datasetIndex: number;
    index: number;
    point: ChartPoint;
}

export function themedColor(index: number) {
    return `var(--rs-chart-series-${(index % 10) + 1}, var(--vis-color${index % 6}))`;
}

export function chartColor(value: ChartColor | undefined, index: number) {
    return Array.isArray(value) ? value[index % value.length] : value;
}

export function chartRows(data: ChartData, type: ChartType) {
    const rowsByX = new Map<number, ChartRow[]>();
    const labels = new Map<number, string>();
    const categories = new Map<string, number>();
    data.labels?.forEach((label, index) => categories.set(String(label), index));
    let nextCategory = data.labels?.length ?? 0;

    data.datasets.forEach((dataset, datasetIndex) => {
        const seen = new Map<number, number>();
        (dataset.data ?? []).forEach((point, index) => {
            const coordinates = Array.isArray(point) ? { x: point[0], y: point[1] } : point;
            const xy = coordinates && typeof coordinates === 'object' ? coordinates : null;
            const rawX = xy?.x ?? index;
            let x: number;
            const category = typeof rawX === 'string' ? rawX : data.labels?.[index];

            if (typeof rawX === 'string') {
                x = categories.get(rawX) ?? nextCategory++;
                categories.set(rawX, x);
            } else {
                x = rawX instanceof Date ? rawX.getTime() : rawX;
            }
            if (!Number.isFinite(x)) return;
            if (category !== undefined) labels.set(x, String(category));

            const indexAtX = seen.get(x) ?? 0;
            seen.set(x, indexAtX + 1);
            const rows = rowsByX.get(x) ?? [];
            const row = (rows[indexAtX] ??= { x, label: String(category ?? rawX), points: [] });
            const y = xy ? xy.y : typeof point === 'number' ? point : null;
            row.points[datasetIndex] = { y: typeof y === 'number' && Number.isFinite(y) ? y : null, index, radius: xy && 'r' in xy ? xy.r : undefined };
            rowsByX.set(x, rows);
        });
    });

    const rows = [...rowsByX.values()].flat();
    return { rows: type === 'pie' || type === 'doughnut' ? rows : rows.sort((a, b) => a.x - b.x), labels };
}
