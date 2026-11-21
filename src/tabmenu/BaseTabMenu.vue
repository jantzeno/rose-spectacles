<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import TabMenuStyle from './style/TabMenuStyle';

export default defineComponent({
    name: 'BaseTabMenu',
    extends: BaseComponent,
    props: {
        model: {
            type: Array,
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
