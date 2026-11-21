<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import FieldsetStyle from './style/FieldsetStyle';

export default defineComponent({
    name: 'BaseFieldset',
    extends: BaseComponent,
    props: {
        legend: String,
        toggleable: Boolean,
        collapsed: Boolean,
        toggleButtonProps: {
            type: null,
            default: null
        }
    },
    style: FieldsetStyle,
    provide() {
        return {
            $pcFieldset: this,
            $parentInstance: this
        };
    }
});
</script>
