<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import CardStyle from './style/CardStyle';

export default defineComponent({
    name: 'BaseCard',
    extends: BaseComponent,
    style: CardStyle,
    provide() {
        return {
            $pcCard: this,
            $parentInstance: this
        };
    }
});
</script>
