<script lang="ts">
import type { MeterItem } from 'rose-spectacles/metergroup';
import { defineComponent, type PropType } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import MeterGroupStyle from './style/MeterGroupStyle';

export default defineComponent({
    name: 'MeterGroup',
    extends: BaseComponent,
    props: {
        value: {
            type: Array as PropType<MeterItem[]>,
            default: null
        },
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 100
        },
        orientation: {
            type: String,
            default: 'horizontal'
        },
        labelPosition: {
            type: String,
            default: 'end'
        },
        labelOrientation: {
            type: String,
            default: 'horizontal'
        }
    },
    style: MeterGroupStyle,
    provide() {
        return {
            $pcMeterGroup: this,
            $parentInstance: this
        };
    }
});
</script>
