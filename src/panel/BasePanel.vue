<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import PanelStyle from './style/PanelStyle';

export default defineComponent({
    name: 'BasePanel',
    extends: BaseComponent,
    props: {
        header: String,
        toggleable: Boolean,
        collapsed: Boolean,
        toggleButtonProps: {
            type: Object,
            default: () => {
                return {
                    severity: 'secondary',
                    text: true,
                    rounded: true
                };
            }
        }
    },
    style: PanelStyle,
    provide() {
        return {
            $pcPanel: this,
            $parentInstance: this
        };
    }
});
</script>
