<script>
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import StepPanelsStyle from './style/StepPanelsStyle';

export default {
    name: 'BaseStepPanels',
    extends: BaseComponent,
    style: StepPanelsStyle,
    provide() {
        return {
            $pcStepPanels: this,
            $parentInstance: this
        };
    }
};
</script>
