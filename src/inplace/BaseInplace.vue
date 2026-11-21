<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import InplaceStyle from './style/InplaceStyle';

export default defineComponent({
    name: 'BaseInplace',
    extends: BaseComponent,
    props: {
        active: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        displayProps: {
            type: null,
            default: null
        }
    },
    style: InplaceStyle,
    provide() {
        return {
            $pcInplace: this,
            $parentInstance: this
        };
    }
});
</script>
