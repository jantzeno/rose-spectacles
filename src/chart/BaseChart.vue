<script lang="ts">
import type { ChartData, ChartOptions, ChartType, Plugin } from 'chart.js';
import { defineComponent, type CanvasHTMLAttributes, type PropType } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import ChartStyle from './style/ChartStyle';

export default defineComponent({
    name: 'BaseChart',
    extends: BaseComponent,
    props: {
        type: String as PropType<ChartType>,
        data: Object as PropType<ChartData>,
        options: Object as PropType<ChartOptions>,
        plugins: Array as PropType<Plugin[]>,
        width: {
            type: Number,
            default: 300
        },
        height: {
            type: Number,
            default: 150
        },
        canvasProps: {
            type: Object as PropType<CanvasHTMLAttributes>,
            default: null
        },
        themed: {
            type: Boolean,
            default: true
        }
    },
    style: ChartStyle,
    provide() {
        return {
            $pcChart: this,
            $parentInstance: this
        };
    }
});
</script>
