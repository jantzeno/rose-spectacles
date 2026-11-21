<script>
import BaseEditableHolder from '../core/baseeditableholder/BaseEditableHolder.vue';
import CheckboxGroupStyle from './style/CheckboxGroupStyle';

export default {
    name: 'BaseCheckboxGroup',
    extends: BaseEditableHolder,
    style: CheckboxGroupStyle,
    provide() {
        return {
            $pcCheckboxGroup: this,
            $parentInstance: this
        };
    }
};
</script>
