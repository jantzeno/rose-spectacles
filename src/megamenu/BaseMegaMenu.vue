<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import MegaMenuStyle from './style/MegaMenuStyle';

export default defineComponent({
    name: 'BaseMegaMenu',
    extends: BaseComponent,
    props: {
        model: {
            type: Array,
            default: null
        },
        orientation: {
            type: String,
            default: 'horizontal'
        },
        breakpoint: {
            type: String,
            default: '960px'
        },
        disabled: {
            type: Boolean,
            default: false
        },
        tabindex: {
            type: Number,
            default: 0
        },
        scrollHeight: {
            type: String,
            default: '20rem'
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
    style: MegaMenuStyle,
    provide() {
        return {
            $pcMegaMenu: this,
            $parentInstance: this
        };
    }
});
</script>
