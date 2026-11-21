<script>
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import DynamicDialogStyle from './style/DynamicDialogStyle';

export default {
    name: 'BaseDynamicDialog',
    extends: BaseComponent,
    props: {},
    style: DynamicDialogStyle,
    provide() {
        return {
            $pcDynamicDialog: this,
            $parentInstance: this
        };
    }
};
</script>
