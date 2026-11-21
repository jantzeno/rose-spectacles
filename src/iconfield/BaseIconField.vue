<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import IconFieldStyle from './style/IconFieldStyle';

export default defineComponent({
    name: 'BaseIconField',
    extends: BaseComponent,
    style: IconFieldStyle,
    provide() {
        return {
            $pcIconField: this,
            $parentInstance: this
        };
    }
});
</script>
