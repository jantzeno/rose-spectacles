<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import ContextMenuStyle from './style/ContextMenuStyle';

export default defineComponent({
    name: 'BaseContextMenu',
    extends: BaseComponent,
    props: {
        model: {
            type: Array,
            default: null
        },
        appendTo: {
            type: [String, Object],
            default: 'body'
        },
        autoZIndex: {
            type: Boolean,
            default: true
        },
        baseZIndex: {
            type: Number,
            default: 0
        },
        global: {
            type: Boolean,
            default: false
        },
        breakpoint: {
            type: String,
            default: '960px'
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
    style: ContextMenuStyle,
    provide() {
        return {
            $pcContextMenu: this,
            $parentInstance: this
        };
    }
});
</script>
