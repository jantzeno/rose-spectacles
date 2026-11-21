<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import IftaLabelStyle from './style/IftaLabelStyle';

export default defineComponent({
    name: 'BaseIftaLabel',
    extends: BaseComponent,
    style: IftaLabelStyle,
    provide() {
        return {
            $pcIftaLabel: this,
            $parentInstance: this
        };
    }
});
</script>
