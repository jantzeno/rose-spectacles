<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import InputGroupStyle from './style/InputGroupStyle';

export default defineComponent({
    name: 'BaseInputGroup',
    extends: BaseComponent,
    style: InputGroupStyle,
    provide() {
        return {
            $pcInputGroup: this,
            $parentInstance: this
        };
    }
});
</script>
