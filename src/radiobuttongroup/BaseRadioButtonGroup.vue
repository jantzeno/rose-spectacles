<script lang="ts">
import { defineComponent } from 'vue';
import BaseEditableHolder from '../core/baseeditableholder/BaseEditableHolder.vue';
import RadioButtonGroupStyle from './style/RadioButtonGroupStyle';

export default defineComponent({
    name: 'BaseRadioButtonGroup',
    extends: BaseEditableHolder,
    style: RadioButtonGroupStyle,
    provide() {
        return {
            $pcRadioButtonGroup: this,
            $parentInstance: this
        };
    }
});
</script>
