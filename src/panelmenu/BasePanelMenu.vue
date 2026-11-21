<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import PanelMenuStyle from './style/PanelMenuStyle';

export default defineComponent({
    name: 'BasePanelMenu',
    extends: BaseComponent,
    props: {
        model: {
            type: Array,
            default: null
        },
        expandedKeys: {
            type: Object,
            default: null
        },
        multiple: {
            type: Boolean,
            default: false
        },
        tabindex: {
            type: Number,
            default: 0
        }
    },
    style: PanelMenuStyle,
    provide() {
        return {
            $pcPanelMenu: this,
            $parentInstance: this
        };
    }
});
</script>
