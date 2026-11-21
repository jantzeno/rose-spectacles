<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import StepItemStyle from './style/StepItemStyle';

export default defineComponent({
    name: 'BaseStepItem',
    extends: BaseComponent,
    props: {
        value: {
            type: [String, Number],
            default: undefined
        }
    },
    style: StepItemStyle,
    provide() {
        return {
            $pcStepItem: this,
            $parentInstance: this
        };
    }
});
</script>
