<script>
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import IftaLabelStyle from './style/IftaLabelStyle';

export default {
    name: 'BaseIftaLabel',
    extends: BaseComponent,
    style: IftaLabelStyle,
    provide() {
        return {
            $pcIftaLabel: this,
            $parentInstance: this
        };
    }
};
</script>
