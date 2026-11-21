<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import StepPanelsStyle from './style/StepPanelsStyle';

export default defineComponent({
    name: 'BaseStepPanels',
    extends: BaseComponent,
    style: StepPanelsStyle,
    provide() {
        return {
            $pcStepPanels: this,
            $parentInstance: this
        };
    }
});
</script>
