<script>
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import ButtonGroupStyle from './style/ButtonGroupStyle';

export default {
    name: 'BaseButtonGroup',
    extends: BaseComponent,
    style: ButtonGroupStyle,
    provide() {
        return {
            $pcButtonGroup: this,
            $parentInstance: this
        };
    }
};
</script>
