import { flushPromises, mount } from '@vue/test-utils';
import { reactive } from 'vue';
import { vi } from 'vitest';
import Chart from './Chart.vue';
import { chartRows } from './model';
import { createChart } from './render';

vi.mock('./render', () => ({
    createChart: vi.fn((_plot, read: () => unknown) => {
        const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        element.append(document.createElementNS(element.namespaceURI, 'path'));
        return { chart: { element }, update: vi.fn(read), destroy: vi.fn() };
    })
}));

const chartFactory = vi.mocked(createChart);

beforeEach(() => {
    chartFactory.mockClear();
});

it('updates a single chart for nested data mutations, replacements, and layout changes', async () => {
    const data = reactive({ datasets: [{ data: [1, 2] }] });
    const wrapper = mount(Chart, { props: { data } });
    try {
        await flushPromises();
        const instance = wrapper.vm.getChart();
        expect(instance).toBeTruthy();
        expect(wrapper.emitted('loaded')).toEqual([[instance]]);

        data.datasets[0].data[1] = 3;
        await wrapper.vm.$nextTick();
        expect(chartFactory.mock.results[0].value.update).toHaveReturnedWith(expect.objectContaining({ data }));

        const replacement = { datasets: [{ data: [9] }] };
        await wrapper.setProps({ data: replacement, options: { responsive: false } });
        expect(chartFactory.mock.results[0].value.update).toHaveLastReturnedWith(
            expect.objectContaining({ data: replacement, options: { responsive: false } })
        );
        expect(wrapper.vm.getChart()).toBe(instance);
        expect(chartFactory).toHaveBeenCalledTimes(1);
    } finally {
        wrapper.unmount();
    }
});

it('replaces the plot when its type changes and disposes both plots', async () => {
    const wrapper = mount(Chart);
    await flushPromises();
    await wrapper.setProps({ type: 'pie' });
    await flushPromises();

    expect(chartFactory).toHaveBeenCalledTimes(2);
    expect(chartFactory.mock.results[0].value.destroy).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.getChart()).toBe(chartFactory.mock.results[1].value.chart);
    expect(wrapper.vm.getSVG()).toContain('<path');
    expect(wrapper.vm.getBase64Image()).toMatch(/^data:image\/svg\+xml;base64,/);
    wrapper.unmount();
    expect(chartFactory.mock.results[1].value.destroy).toHaveBeenCalledTimes(1);
});

it('does not create a chart when unmounted before the engine loads', async () => {
    const wrapper = mount(Chart);
    wrapper.unmount();
    await flushPromises();
    expect(chartFactory).not.toHaveBeenCalled();
});

it('aligns labeled datasets and retains nulls and repeated scatter coordinates', () => {
    const labeled = chartRows({ labels: ['Draft', 'Final'], datasets: [{ data: [1, null] }, { data: [7] }] }, 'bar');
    expect([...labeled.labels]).toEqual([
        [0, 'Draft'],
        [1, 'Final']
    ]);
    expect(labeled.rows.map((row) => row.points.map((point) => point?.y))).toEqual([[1, 7], [null]]);

    const scatter = chartRows(
        {
            datasets: [
                {
                    data: [
                        { x: 3, y: 1 },
                        { x: 3, y: 4, r: 8 }
                    ]
                },
                { data: [[3, 6]] }
            ]
        },
        'bubble'
    );
    expect(scatter.rows.map((row) => [row.x, row.points.map((point) => [point?.y, point?.radius])])).toEqual([
        [
            3,
            [
                [1, undefined],
                [6, undefined]
            ]
        ],
        [3, [[4, 8]]]
    ]);
});

it('maps named points to the declared order without mutating the caller’s data', () => {
    const point = { x: 'March', y: 2 };
    const data = { labels: ['March', 'April'], datasets: [{ data: [{ x: 'April', y: 5 }, point] }, { data: [{ x: 'March', y: 7 }] }] };
    const { rows } = chartRows(data, 'bar');
    expect(rows.map((row) => [row.label, row.points.map((value) => value?.y)])).toEqual([
        ['March', [2, 7]],
        ['April', [5]]
    ]);
    const first = rows[0].points[0];
    if (first) first.y = 10;
    expect(point.y).toBe(2);
});
