<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import InlineMessageStyle from './style/InlineMessageStyle';

export default defineComponent({
    name: 'BaseInlineMessage',
    extends: BaseComponent,
    props: {
        severity: {
            type: String,
            default: 'error'
        },
        icon: {
            type: String,
            default: undefined
        }
    },
    style: InlineMessageStyle,
    provide() {
        return {
            $pcInlineMessage: this,
            $parentInstance: this
        };
    }
});
</script>
