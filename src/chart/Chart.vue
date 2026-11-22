<template>
    <div :class="cx('root')" :style="sx('root')" v-bind="ptmi('root')">
        <ul v-if="legend.length" :class="cx('legend')" aria-label="Chart legend">
            <li v-for="(entry, index) in legend" :key="index"><span aria-hidden="true" :style="{ backgroundColor: entry.color }"></span>{{ entry.label }}</li>
        </ul>
        <div
            ref="plot"
            :class="[cx('plot'), { 'rs-chart-themed': themed && !isUnstyled }]"
            :style="plotSize"
            role="img"
            v-bind="{ ...canvasProps, ...containerProps, ...ptm('canvas'), ...ptm('plot') }"
        ></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, shallowRef } from 'vue';
import BaseChart from './BaseChart.vue';
import { chartColor, themedColor } from './model';
import type { createChart } from './render';

export default defineComponent({
    name: 'Chart',
    extends: BaseChart,
    inheritAttrs: false,
    emits: ['select', 'loaded'],
    data() {
        return {
            binding: shallowRef<ReturnType<typeof createChart> | null>(null),
            generation: 0
        };
    },
    computed: {
        plotSize() {
            return { width: this.options?.responsive === false ? `${this.width}px` : '100%', height: `${this.height}px` };
        },
        legend() {
            if (this.options?.legend === false || this.options?.plugins?.legend?.display === false || !this.data) return [];
            const fill = (index: number) => (this.themed ? themedColor(index) : `var(--vis-color${index % 6})`);

            if (this.type === 'pie' || this.type === 'doughnut') {
                return (this.data.labels ?? []).map((label, index) => ({
                    label,
                    color: chartColor(this.data?.datasets[0]?.backgroundColor, index) ?? fill(index)
                }));
            }

            return this.data.datasets.flatMap((dataset, index) =>
                dataset.label
                    ? [
                          {
                              label: dataset.label,
                              color: chartColor(dataset.backgroundColor ?? dataset.borderColor, 0) ?? fill(index)
                          }
                      ]
                    : []
            );
        }
    },
    watch: {
        data: { handler: 'refresh', deep: true },
        options: { handler: 'refresh', deep: true },
        type: 'reinit',
        width: 'refresh',
        height: 'refresh',
        themed: 'refresh'
    },
    mounted() {
        void this.reinit();
    },
    beforeUnmount() {
        this.generation++;
        this.binding?.destroy();
        this.binding = null;
    },
    methods: {
        async reinit() {
            const generation = ++this.generation;
            const plot = this.$refs.plot as HTMLElement;

            try {
                const { createChart } = await import('./render');
                if (generation !== this.generation) return;
                this.binding?.destroy();
                this.binding = null;
                this.binding = createChart(
                    plot,
                    () => ({
                        type: this.type,
                        data: this.data ?? { datasets: [] },
                        options: this.options ?? {},
                        width: this.width,
                        height: this.height,
                        themed: this.themed
                    }),
                    (event) => this.$emit('select', event)
                );
                this.$emit('loaded', this.binding.chart);
            } catch (error) {
                console.error('[Rose Spectacles] Could not load the Unovis chart.', error);
            }
        },
        refresh() {
            this.binding?.update();
        },
        getChart() {
            return this.binding?.chart ?? null;
        },
        getSVG() {
            const svg = this.getChart()?.element;
            if (!svg) return '';

            const clone = svg.cloneNode(true) as SVGSVGElement;
            const styleProperties = [
                'display',
                'visibility',
                'opacity',
                'fill',
                'fill-opacity',
                'stroke',
                'stroke-width',
                'stroke-opacity',
                'stroke-dasharray',
                'font-family',
                'font-size',
                'font-weight',
                'text-anchor'
            ];
            const children = clone.querySelectorAll<SVGElement>('*');
            svg.querySelectorAll('*').forEach((element, index) => {
                const style = getComputedStyle(element);
                for (const property of styleProperties) {
                    const value = style.getPropertyValue(property);
                    if (value) children[index].style.setProperty(property, value);
                }
            });
            return new XMLSerializer().serializeToString(clone);
        },
        getBase64Image() {
            const svg = this.getSVG();
            if (!svg) return '';
            const bytes = new TextEncoder().encode(svg);
            return `data:image/svg+xml;base64,${btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(''))}`;
        }
    }
});
</script>
