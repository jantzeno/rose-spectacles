<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import ChipStyle from './style/ChipStyle';

export default defineComponent({
    name: 'BaseChip',
    extends: BaseComponent,
    props: {
        label: {
            type: [String, Number],
            default: null
        },
        icon: {
            type: String,
            default: null
        },
        image: {
            type: String,
            default: null
        },
        removable: {
            type: Boolean,
            default: false
        },
        removeIcon: {
            type: String,
            default: undefined
        }
    },
    style: ChipStyle,
    provide() {
        return {
            $pcChip: this,
            $parentInstance: this
        };
    }
});
</script>
