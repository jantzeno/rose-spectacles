<script>
import BaseInput from '../core/baseinput/BaseInput.vue';
import InputTextStyle from './style/InputTextStyle';

export default {
    name: 'BaseInputText',
    extends: BaseInput,
    style: InputTextStyle,
    provide() {
        return {
            $pcInputText: this,
            $parentInstance: this
        };
    }
};
</script>
