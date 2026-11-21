<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { MenuItem } from 'rose-spectacles/menuitem';
import type { PanelMenuExpandedKeys } from 'rose-spectacles/panelmenu';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import PanelMenuStyle from './style/PanelMenuStyle';

export default defineComponent({
    name: 'BasePanelMenu',
    extends: BaseComponent,
    props: {
        model: {
            type: Array as PropType<MenuItem[]>,
            default: null
        },
        expandedKeys: {
            type: Object as PropType<PanelMenuExpandedKeys>,
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
