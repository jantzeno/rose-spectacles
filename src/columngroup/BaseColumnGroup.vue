<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import ColumnGroupStyle from './style/ColumnGroupStyle';

export default defineComponent({
    name: 'BaseColumnGroup',
    extends: BaseComponent,
    props: {
        type: {
            type: String,
            default: null
        }
    },
    style: ColumnGroupStyle,
    provide() {
        return {
            $pcColumnGroup: this,
            $parentInstance: this
        };
    }
});
</script>
