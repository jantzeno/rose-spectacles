<script lang="ts">
import { defineComponent } from 'vue';
import BaseEditableHolder from '../core/baseeditableholder/BaseEditableHolder.vue';
import CheckboxGroupStyle from './style/CheckboxGroupStyle';

export default defineComponent({
    name: 'BaseCheckboxGroup',
    extends: BaseEditableHolder,
    style: CheckboxGroupStyle,
    provide() {
        return {
            $pcCheckboxGroup: this,
            $parentInstance: this
        };
    }
});
</script>
