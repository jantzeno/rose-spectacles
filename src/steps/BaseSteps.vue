<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { MenuItem } from 'rose-spectacles/menuitem';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import StepsStyle from './style/StepsStyle';

export default defineComponent({
    name: 'BaseSteps',
    extends: BaseComponent,
    props: {
        id: {
            type: String
        },
        model: {
            type: Array as PropType<MenuItem[]>,
            default: null
        },
        readonly: {
            type: Boolean,
            default: true
        },
        activeStep: {
            type: Number,
            default: 0
        }
    },
    style: StepsStyle,
    provide() {
        return {
            $pcSteps: this,
            $parentInstance: this
        };
    }
});
</script>
