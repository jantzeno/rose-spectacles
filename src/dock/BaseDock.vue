<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { MenuItem } from 'rose-spectacles/menuitem';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import DockStyle from './style/DockStyle';

export default defineComponent({
    name: 'BaseDock',
    extends: BaseComponent,
    props: {
        position: {
            type: String,
            default: 'bottom'
        },
        model: null as unknown as PropType<MenuItem[]>,
        class: null,
        style: null,
        tooltipOptions: null,
        menuId: {
            type: String,
            default: null
        },
        tabindex: {
            type: Number,
            default: 0
        },
        breakpoint: {
            type: String,
            default: '960px'
        },
        ariaLabel: {
            type: String,
            default: null
        },
        ariaLabelledby: {
            type: String,
            default: null
        }
    },
    style: DockStyle,
    provide() {
        return {
            $pcDock: this,
            $parentInstance: this
        };
    }
});
</script>
