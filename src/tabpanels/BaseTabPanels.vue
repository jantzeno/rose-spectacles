<script>
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import TabPanelsStyle from './style/TabPanelsStyle';

export default {
    name: 'BaseTabPanels',
    extends: BaseComponent,
    props: {},
    style: TabPanelsStyle,
    provide() {
        return {
            $pcTabPanels: this,
            $parentInstance: this
        };
    }
};
</script>
