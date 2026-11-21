<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { MenuItem } from '../menuitem/MenuItem';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import MenubarStyle from './style/MenubarStyle';

export default defineComponent({
    name: 'BaseMenubar',
    extends: BaseComponent,
    props: {
        model: {
            type: Array as PropType<MenuItem[]>,
            default: null
        },
        buttonProps: {
            type: null,
            default: null
        },
        breakpoint: {
            type: String,
            default: '960px'
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
    style: MenubarStyle,
    provide() {
        return {
            $pcMenubar: this,
            $parentInstance: this
        };
    }
});
</script>
