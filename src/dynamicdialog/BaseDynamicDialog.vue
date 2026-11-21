<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import DynamicDialogStyle from './style/DynamicDialogStyle';

export default defineComponent({
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
});
</script>
