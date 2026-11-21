<script>
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import ProgressSpinnerStyle from './style/ProgressSpinnerStyle';

export default {
    name: 'BaseProgressSpinner',
    extends: BaseComponent,
    props: {
        strokeWidth: {
            type: String,
            default: '2'
        },
        fill: {
            type: String,
            default: 'none'
        },
        animationDuration: {
            type: String,
            default: '2s'
        }
    },
    style: ProgressSpinnerStyle,
    provide() {
        return {
            $pcProgressSpinner: this,
            $parentInstance: this
        };
    }
};
</script>
