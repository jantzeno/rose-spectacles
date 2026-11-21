<script>
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import CardStyle from './style/CardStyle';

export default {
    name: 'BaseCard',
    extends: BaseComponent,
    style: CardStyle,
    provide() {
        return {
            $pcCard: this,
            $parentInstance: this
        };
    }
};
</script>
