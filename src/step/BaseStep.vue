<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import StepStyle from './style/StepStyle';

export default defineComponent({
    name: 'BaseStep',
    extends: BaseComponent,
    props: {
        value: {
            type: [String, Number],
            default: undefined
        },
        disabled: {
            type: Boolean,
            default: false
        },
        asChild: {
            type: Boolean,
            default: false
        },
        as: {
            type: [String, Object],
            default: 'DIV'
        }
    },
    style: StepStyle,
    provide() {
        return {
            $pcStep: this,
            $parentInstance: this
        };
    }
});
</script>
