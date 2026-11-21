<script>
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import ColumnGroupStyle from './style/ColumnGroupStyle';

export default {
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
};
</script>
