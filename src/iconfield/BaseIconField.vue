<script>
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import IconFieldStyle from './style/IconFieldStyle';

export default {
    name: 'BaseIconField',
    extends: BaseComponent,
    style: IconFieldStyle,
    provide() {
        return {
            $pcIconField: this,
            $parentInstance: this
        };
    }
};
</script>
