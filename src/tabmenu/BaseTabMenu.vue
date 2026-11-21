<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { MenuItem } from 'rose-spectacles/menuitem';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import TabMenuStyle from './style/TabMenuStyle';

export default defineComponent({
    name: 'BaseTabMenu',
    extends: BaseComponent,
    props: {
        model: {
            type: Array as PropType<MenuItem[]>,
            default: null
        },
        activeIndex: {
            type: Number,
            default: 0
        },
        ariaLabelledby: {
            type: String,
            default: null
        },
        ariaLabel: {
            type: String,
            default: null
        }
    },
    style: TabMenuStyle,
    provide() {
        return {
            $pcTabMenu: this,
            $parentInstance: this
        };
    }
});
</script>
