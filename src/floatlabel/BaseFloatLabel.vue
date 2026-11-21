<script>
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import FloatLabelStyle from './style/FloatLabelStyle';

export default {
    name: 'BaseFloatLabel',
    extends: BaseComponent,
    props: {
        variant: {
            type: String,
            default: 'over'
        }
    },
    style: FloatLabelStyle,
    provide() {
        return {
            $pcFloatLabel: this,
            $parentInstance: this
        };
    }
};
</script>
