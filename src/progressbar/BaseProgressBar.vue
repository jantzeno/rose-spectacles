<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import ProgressBarStyle from './style/ProgressBarStyle';

export default defineComponent({
    name: 'BaseProgressBar',
    extends: BaseComponent,
    props: {
        value: {
            type: Number,
            default: null
        },
        mode: {
            type: String,
            default: 'determinate'
        },
        showValue: {
            type: Boolean,
            default: true
        }
    },
    style: ProgressBarStyle,
    provide() {
        return {
            $pcProgressBar: this,
            $parentInstance: this
        };
    }
});
</script>
