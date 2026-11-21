<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { MenuItem } from '../menuitem/MenuItem';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import TieredMenuStyle from './style/TieredMenuStyle';

export default defineComponent({
    name: 'BaseTieredMenu',
    extends: BaseComponent,
    props: {
        popup: {
            type: Boolean,
            default: false
        },
        model: {
            type: Array as PropType<MenuItem[]>,
            default: null
        },
        appendTo: {
            type: [String, Object],
            default: 'body'
        },
        breakpoint: {
            type: String,
            default: '960px'
        },
        autoZIndex: {
            type: Boolean,
            default: true
        },
        baseZIndex: {
            type: Number,
            default: 0
        },
        disabled: {
            type: Boolean,
            default: false
        },
        tabindex: {
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
    style: TieredMenuStyle,
    provide() {
        return {
            $pcTieredMenu: this,
            $parentInstance: this
        };
    }
});
</script>
