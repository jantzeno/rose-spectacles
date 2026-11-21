<script lang="ts">
import { defineComponent } from 'vue';
import BaseInput from '../core/baseinput/BaseInput.vue';
import InputTextStyle from './style/InputTextStyle';

export default defineComponent({
    name: 'BaseInputText',
    extends: BaseInput,
    style: InputTextStyle,
    provide() {
        return {
            $pcInputText: this,
            $parentInstance: this
        };
    }
});
</script>
