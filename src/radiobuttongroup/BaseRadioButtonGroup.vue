<script>
import BaseEditableHolder from '../core/baseeditableholder/BaseEditableHolder.vue';
import RadioButtonGroupStyle from './style/RadioButtonGroupStyle';

export default {
    name: 'BaseRadioButtonGroup',
    extends: BaseEditableHolder,
    style: RadioButtonGroupStyle,
    provide() {
        return {
            $pcRadioButtonGroup: this,
            $parentInstance: this
        };
    }
};
</script>
