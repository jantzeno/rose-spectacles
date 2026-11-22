<script lang="ts">
import { defineComponent, type HTMLAttributes, type PropType } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import type { ChartData, ChartOptions, ChartType } from './model';
import ChartStyle from './style/ChartStyle';

export default defineComponent({
    name: 'BaseChart',
    extends: BaseComponent,
    props: {
        type: { type: String as PropType<ChartType>, default: 'bar' },
        data: Object as PropType<ChartData>,
        options: Object as PropType<ChartOptions>,
        width: {
            type: Number,
            default: 300
        },
        height: {
            type: Number,
            default: 150
        },
        canvasProps: Object as PropType<HTMLAttributes>,
        containerProps: Object as PropType<HTMLAttributes>,
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
