<script>
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import InputGroupStyle from './style/InputGroupStyle';

export default {
    name: 'BaseInputGroup',
    extends: BaseComponent,
    style: InputGroupStyle,
    provide() {
        return {
            $pcInputGroup: this,
            $parentInstance: this
        };
    }
};
</script>
