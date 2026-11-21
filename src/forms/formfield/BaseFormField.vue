<script lang="ts">
import type { useFormFieldOptions } from 'rose-spectacles/forms/useform';
import { defineComponent, type PropType } from 'vue';
import BaseComponent from '../../core/basecomponent/BaseComponent.vue';
import FormFieldStyle from './style/FormFieldStyle';

export default defineComponent({
    name: 'BaseFormField',
    extends: BaseComponent,
    style: FormFieldStyle,
    props: {
        name: {
            type: String,
            default: undefined
        },
        resolver: {
            type: Function as PropType<useFormFieldOptions['resolver']>,
            default: undefined
        },
        initialValue: {
            type: null,
            default: undefined
        },
        validateOnValueUpdate: {
            type: Boolean,
            default: undefined
        },
        validateOnBlur: {
            type: Boolean,
            default: undefined
        },
        validateOnMount: {
            type: Boolean,
            default: undefined
        },
        validateOnSubmit: {
            type: Boolean,
            default: undefined
        },
        as: {
            type: [String, Object],
            default: 'DIV'
        },
        asChild: {
            type: Boolean,
            default: false
        }
    },
    provide() {
        return {
            $pcFormField: this,
            $parentInstance: this
        };
    }
});
</script>
