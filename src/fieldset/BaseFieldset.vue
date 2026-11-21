<script>
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import FieldsetStyle from './style/FieldsetStyle';

export default {
    name: 'BaseFieldset',
    extends: BaseComponent,
    props: {
        legend: String,
        toggleable: Boolean,
        collapsed: Boolean,
        toggleButtonProps: {
            type: null,
            default: null
        }
    },
    style: FieldsetStyle,
    provide() {
        return {
            $pcFieldset: this,
            $parentInstance: this
        };
    }
};
</script>
