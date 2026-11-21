<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import ToolbarStyle from './style/ToolbarStyle';

export default defineComponent({
    name: 'BaseToolbar',
    extends: BaseComponent,
    props: {
        ariaLabelledby: {
            type: String,
            default: null
        }
    },
    style: ToolbarStyle,
    provide() {
        return {
            $pcToolbar: this,
            $parentInstance: this
        };
    }
});
</script>
