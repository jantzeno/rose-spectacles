<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import FluidStyle from './style/FluidStyle';

export default defineComponent({
    name: 'BaseFluid',
    extends: BaseComponent,
    style: FluidStyle,
    provide() {
        return {
            $pcFluid: this,
            $parentInstance: this
        };
    }
});
</script>
