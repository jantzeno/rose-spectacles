import { flushPromises, mount } from '@vue/test-utils';
import { vi } from 'vitest';
import { isReactive, reactive } from 'vue';
import ChartJS from 'chart.js/auto';
import type { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import type { ChartProps } from 'rose-spectacles/chart';
import Chart from './Chart.vue';
import { applyPalette, mergeOptions } from './utils/ChartTheme';

interface MockChart {
    canvas: HTMLCanvasElement;
    data: ChartData;
    options?: ChartOptions;
    update: ReturnType<typeof vi.fn>;
    destroy: ReturnType<typeof vi.fn>;
    toBase64Image: ReturnType<typeof vi.fn>;
    getElementsAtEventForMode?: () => { index: number }[];
}

vi.mock('chart.js/auto', () => {
    const instances: MockChart[] = [];

    class ChartJSMock implements MockChart {
        static instances = instances;
        canvas: HTMLCanvasElement;
        data: ChartData;
        options?: ChartOptions;
        update = vi.fn();
        destroy = vi.fn();
        toBase64Image = vi.fn(() => 'data:image/png;base64,stub');

        constructor(canvas: HTMLCanvasElement, config: ChartConfiguration) {
            this.canvas = canvas;
            this.data = config.data;
            this.options = config.options;
            instances.push(this);
        }
    }

    return { default: ChartJSMock };
});

const { instances } = ChartJS as unknown as { instances: MockChart[] };

const data = {
    labels: ['Q1', 'Q2'],
    datasets: [{ label: 'Sales', data: [1, 2] }]
};

const mountChart = async (props: ChartProps = {}) => {
    const wrapper = mount(Chart, { props: { type: 'bar', data, ...props } });

    await flushPromises();

    return wrapper;
};

describe('Chart.vue', () => {
    beforeEach(() => {
        instances.length = 0;
    });

    it('is canvas element exist', async () => {
        const wrapper = await mountChart();

        expect(wrapper.find('canvas').exists()).toBe(true);
        expect(instances.length).toBe(1);
    });

    it('is getCanvas returning the rendered canvas element', async () => {
        const wrapper = await mountChart();

        expect(wrapper.vm.getCanvas()).toBe(wrapper.find('canvas').element);
    });

    it('is getChart returning the chart instance', async () => {
        const wrapper = await mountChart();

        expect(wrapper.vm.getChart()).toBe(instances[0]);
    });

    it('is loaded event emitted with the chart instance', async () => {
        const wrapper = await mountChart();

        expect(wrapper.emitted('loaded')?.[0]?.[0]).toBe(instances[0]);
    });

    it('is data change updating the chart instead of recreating it', async () => {
        const wrapper = await mountChart();
        const chart = instances[0];

        await wrapper.setProps({ data: { labels: ['Q1'], datasets: [{ label: 'Sales', data: [9] }] } });

        expect(chart.update).toHaveBeenCalled();
        expect(chart.destroy).not.toHaveBeenCalled();
        expect(instances.length).toBe(1);
    });

    it('is replaced data reassigned before updating', async () => {
        const wrapper = await mountChart();
        const chart = instances[0];
        const next = { labels: ['Q1'], datasets: [{ label: 'Sales', data: [9] }] };

        await wrapper.setProps({ data: next });

        expect(chart.data).toEqual(next);
    });

    it('is options change updating the chart instead of recreating it', async () => {
        const wrapper = await mountChart({ options: { responsive: true } });
        const chart = instances[0];

        await wrapper.setProps({ options: { responsive: false } });

        expect(chart.options).toEqual({ responsive: false });
        expect(chart.update).toHaveBeenCalled();
        expect(instances.length).toBe(1);
    });

    it('is chart given raw data rather than reactive proxies', async () => {
        const source = reactive({ datasets: [{ label: 'Sales', data: [{ x: 1, y: 2 }] }] });

        await mountChart({ data: source, options: reactive({ parsing: false as const }) });

        expect(isReactive(instances[0].data.datasets[0].data)).toBe(false);
        expect(isReactive(instances[0].options)).toBe(false);
    });

    it('is chart.js writing into the data not retriggering an update', async () => {
        const source = reactive({ datasets: [{ label: 'Sales', data: [{ x: 1, y: 2 }] }] });

        await mountChart({ data: source, options: { parsing: false, scales: { y: { stacked: true } } } });

        const chart = instances[0];

        // what Chart.js does to each point while stacking with parsing disabled
        Object.assign(chart.data.datasets[0].data[0] as object, { _stacks: { y: {} } });
        await flushPromises();

        expect(chart.update).not.toHaveBeenCalled();
    });

    it('is type change recreating the chart', async () => {
        const wrapper = await mountChart();
        const first = instances[0];

        await wrapper.setProps({ type: 'line' });
        await flushPromises();

        expect(first.destroy).toHaveBeenCalled();
        expect(instances.length).toBe(2);
    });

    it('is chart destroyed on unmount', async () => {
        const wrapper = await mountChart();
        const chart = instances[0];

        wrapper.unmount();

        expect(chart.destroy).toHaveBeenCalled();
    });

    it('is no chart created when unmounted before the import resolves', async () => {
        const wrapper = mount(Chart, { props: { type: 'bar', data } });

        wrapper.unmount();
        await flushPromises();

        expect(instances.length).toBe(0);
    });

    it('is theme applied from design tokens when they resolve', async () => {
        const wrapper = await mountChart();

        /*
         * jsdom does not inherit custom properties to descendants the way browsers do,
         * so the tokens are set on the element the component reads from.
         */
        const el = wrapper.element;

        el.style.setProperty('--rs-text-color', '#111827');
        el.style.setProperty('--rs-text-muted-color', '#6b7280');
        el.style.setProperty('--rs-content-border-color', '#e5e7eb');
        el.style.setProperty('--rs-content-background', '#ffffff');
        el.style.setProperty('--rs-blue-500', '#3b82f6');

        wrapper.vm.syncChart();

        expect(wrapper.vm.getChart()).toMatchObject({
            options: { scales: { x: { ticks: { color: '#6b7280' } } }, plugins: { legend: { labels: { color: '#111827' } } } },
            data: { datasets: [{ backgroundColor: '#3b82f6' }] }
        });
    });

    it('is dark scheme selected from the resolved surface', async () => {
        const wrapper = await mountChart();
        const el = wrapper.element;

        el.style.setProperty('--rs-text-color', '#f8fafc');
        el.style.setProperty('--rs-content-background', '#0f172a');
        el.style.setProperty('--rs-blue-500', '#3b82f6');
        el.style.setProperty('--rs-amber-600', '#d97706');

        wrapper.vm.syncChart();

        // second slot resolves the dark step (amber.600) rather than the light one
        expect(wrapper.vm.getChart()?.options).toMatchObject({ plugins: { legend: { labels: { color: '#f8fafc' } } } });
    });

    it('is user options taking precedence over token defaults', async () => {
        const wrapper = await mountChart({ options: { scales: { x: { ticks: { color: 'rebeccapurple' } } } } });

        expect(wrapper.vm.getChart()?.options).toMatchObject({ scales: { x: { ticks: { color: 'rebeccapurple' } } } });
    });

    it('is themed disabled passing options through untouched', async () => {
        const options = { scales: { x: { ticks: { color: 'red' } } } };
        const wrapper = await mountChart({ themed: false, options });

        expect(wrapper.vm.getChart()?.options).toEqual(options);
    });

    it('is select event emitted on canvas click', async () => {
        const wrapper = await mountChart();
        const element = { index: 0 };

        instances[0].getElementsAtEventForMode = vi.fn(() => [element]);

        await wrapper.find('canvas').trigger('click');

        expect(wrapper.emitted<[{ element: typeof element }]>('select')?.[0]?.[0].element).toBe(element);
    });
});

describe('ChartTheme.mergeOptions', () => {
    it('is user value winning at any depth', () => {
        const merged = mergeOptions({ scales: { x: { ticks: { color: 'token' } } } }, { scales: { x: { ticks: { color: 'user' } } } });

        expect(merged).toMatchObject({ scales: { x: { ticks: { color: 'user' } } } });
    });

    it('is token defaults kept where the user set nothing', () => {
        const merged = mergeOptions({ scales: { x: { ticks: { color: 'token' }, grid: { color: 'grid' } } } }, { scales: { x: { ticks: { color: 'user' } } } });

        expect(merged).toMatchObject({ scales: { x: { grid: { color: 'grid' } } } });
    });

    it('is arrays replaced rather than merged', () => {
        expect(mergeOptions({ list: [1, 2, 3] }, { list: [9] })).toEqual({ list: [9] });
    });
});

describe('ChartTheme.applyPalette', () => {
    const palette = ['#111', '#222', '#333'];

    it('is slots assigned by dataset index', () => {
        const result = applyPalette({ datasets: [{ data: [1] }, { data: [2] }] }, 'line', palette);

        expect(result.datasets[0]).toHaveProperty('borderColor', '#111');
        expect(result.datasets[1]).toHaveProperty('borderColor', '#222');
    });

    it('is user supplied colors left alone', () => {
        const result = applyPalette({ datasets: [{ data: [1], borderColor: 'hotpink' }] }, 'line', palette);

        expect(result.datasets[0]).toHaveProperty('borderColor', 'hotpink');
    });

    it('is radial types colored per data point', () => {
        const result = applyPalette({ datasets: [{ data: [1, 2, 3] }] }, 'pie', palette);

        expect(result.datasets[0]).toHaveProperty('backgroundColor', palette);
    });

    it('is scatter keeping its points visible', () => {
        const result = applyPalette({ datasets: [{ data: [{ x: 1, y: 2 }] }] }, 'scatter', palette);

        // the points are the whole chart, so hiding them the way a line does renders nothing
        expect((result.datasets[0] as { pointRadius?: number }).pointRadius).toBeGreaterThan(0);
    });

    it('is line hiding its points until hover', () => {
        const result = applyPalette({ datasets: [{ data: [1, 2] }] }, 'line', palette);

        expect(result.datasets[0]).toHaveProperty('pointRadius', 0);
        expect((result.datasets[0] as { pointHoverRadius?: number }).pointHoverRadius).toBeGreaterThan(0);
    });

    it('is bubble radius left to the data', () => {
        const result = applyPalette({ datasets: [{ data: [{ x: 1, y: 2, r: 9 }] }] }, 'bubble', palette);

        expect(result.datasets[0]).not.toHaveProperty('pointRadius');
    });

    it('is source data not mutated', () => {
        const source = { datasets: [{ data: [1] }] };

        applyPalette(source, 'bar', palette);

        expect(source.datasets[0]).not.toHaveProperty('borderColor');
    });
});
