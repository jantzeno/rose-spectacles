<script>
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import InputGroupAddonStyle from './style/InputGroupAddonStyle';

export default {
    name: 'BaseInputGroupAddon',
    extends: BaseComponent,
    style: InputGroupAddonStyle,
    provide() {
        return {
            $pcInputGroupAddon: this,
            $parentInstance: this
        };
    }
};
</script>
