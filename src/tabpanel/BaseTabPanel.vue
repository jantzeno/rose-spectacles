<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import TabPanelStyle from './style/TabPanelStyle';

export default defineComponent({
    name: 'BaseTabPanel',
    extends: BaseComponent,
    props: {
        value: {
            type: [String, Number],
            default: undefined
        },
        as: {
            type: [String, Object],
            default: 'DIV'
        },
        asChild: {
            type: Boolean,
            default: false
        }
    },
    style: TabPanelStyle,
    provide() {
        return {
            $pcTabPanel: this,
            $parentInstance: this
        };
    }
});
</script>
