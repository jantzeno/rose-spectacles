<script lang="ts">
import { defineComponent } from 'vue';
import BaseEditableHolder from '../core/baseeditableholder/BaseEditableHolder.vue';
import SelectButtonStyle from './style/SelectButtonStyle';

export default defineComponent({
    name: 'BaseSelectButton',
    extends: BaseEditableHolder,
    props: {
        options: Array,
        optionLabel: null,
        optionValue: null,
        optionDisabled: null,
        multiple: Boolean,
        allowEmpty: {
            type: Boolean,
            default: true
        },
        dataKey: null,
        ariaLabelledby: {
            type: String,
            default: null
        },
        size: {
            type: String,
            default: null
        },
        fluid: {
            type: Boolean,
            default: null
        }
    },
    style: SelectButtonStyle,
    provide() {
        return {
            $pcSelectButton: this,
            $parentInstance: this
        };
    }
});
</script>
