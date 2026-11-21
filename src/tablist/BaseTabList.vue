<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import TabListStyle from './style/TabListStyle';

export default defineComponent({
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
});
</script>
