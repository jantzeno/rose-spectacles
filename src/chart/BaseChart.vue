<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import ChartStyle from './style/ChartStyle';

export default defineComponent({
    name: 'BaseChart',
    extends: BaseComponent,
    props: {
        type: String,
        data: null,
        options: null,
        plugins: null,
        width: {
            type: Number,
            default: 300
        },
        height: {
            type: Number,
            default: 150
        },
        canvasProps: {
            type: null,
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
