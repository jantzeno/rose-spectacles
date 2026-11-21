<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import ProgressSpinnerStyle from './style/ProgressSpinnerStyle';

export default defineComponent({
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
});
</script>
