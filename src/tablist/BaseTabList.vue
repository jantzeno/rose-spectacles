<script>
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import TabListStyle from './style/TabListStyle';

export default {
    name: 'BaseTabList',
    extends: BaseComponent,
    props: {},
    style: TabListStyle,
    provide() {
        return {
            $pcTabList: this,
            $parentInstance: this
        };
    }
};
</script>
