<script>
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import StepListStyle from './style/StepListStyle';

export default {
    name: 'BaseStepList',
    extends: BaseComponent,
    style: StepListStyle,
    provide() {
        return {
            $pcStepList: this,
            $parentInstance: this
        };
    }
};
</script>
