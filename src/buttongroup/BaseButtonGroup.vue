<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import ButtonGroupStyle from './style/ButtonGroupStyle';

export default defineComponent({
    name: 'BaseButtonGroup',
    extends: BaseComponent,
    style: ButtonGroupStyle,
    provide() {
        return {
            $pcButtonGroup: this,
            $parentInstance: this
        };
    }
});
</script>
