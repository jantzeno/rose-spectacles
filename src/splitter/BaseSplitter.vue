<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import SplitterStyle from './style/SplitterStyle';

export default defineComponent({
    name: 'BaseSplitter',
    extends: BaseComponent,
    props: {
        layout: {
            type: String as PropType<'horizontal' | 'vertical'>,
            default: 'horizontal'
        },
        gutterSize: {
            type: Number,
            default: 4
        },
        stateKey: {
            type: String,
            default: null
        },
        stateStorage: {
            type: String,
            default: 'session'
        },
        step: {
            type: Number,
            default: 5
        }
    },
    style: SplitterStyle,
    provide() {
        return {
            $pcSplitter: this,
            $parentInstance: this
        };
    }
});
</script>
