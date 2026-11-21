<script>
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import TerminalStyle from './style/TerminalStyle';

export default {
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
};
</script>
