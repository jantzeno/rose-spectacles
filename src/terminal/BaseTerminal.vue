<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import TerminalStyle from './style/TerminalStyle';

export default defineComponent({
    name: 'BaseTerminal',
    extends: BaseComponent,
    props: {
        welcomeMessage: {
            type: String,
            default: null
        },
        prompt: {
            type: String,
            default: null
        }
    },
    style: TerminalStyle,
    provide() {
        return {
            $pcTerminal: this,
            $parentInstance: this
        };
    }
});
</script>
