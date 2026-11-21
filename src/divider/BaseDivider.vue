<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import DividerStyle from './style/DividerStyle';

export default defineComponent({
    name: 'BaseDivider',
    extends: BaseComponent,
    props: {
        align: {
            type: String,
            default: null
        },
        layout: {
            type: String as PropType<'horizontal' | 'vertical'>,
            default: 'horizontal'
        },
        type: {
            type: String,
            default: 'solid'
        }
    },
    style: DividerStyle,
    provide() {
        return {
            $pcDivider: this,
            $parentInstance: this
        };
    }
});
</script>
