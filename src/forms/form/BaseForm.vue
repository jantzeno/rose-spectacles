<script lang="ts">
import type { useFormOptions } from 'rose-spectacles/forms/useform';
import { defineComponent, type PropType } from 'vue';
import BaseComponent from '../../core/basecomponent/BaseComponent.vue';
import FormStyle from './style/FormStyle';

export default defineComponent({
    name: 'BaseForm',
    extends: BaseComponent,
    style: FormStyle,
    props: {
        resolver: {
            type: Function as PropType<useFormOptions['resolver']>,
            default: null
        },
        initialValues: {
            type: Object,
            default: null
        },
        validateOnValueUpdate: {
            type: [Boolean, Array] as PropType<boolean | string[]>,
            default: true
        },
        validateOnBlur: {
            type: [Boolean, Array] as PropType<boolean | string[]>,
            default: false
        },
        validateOnMount: {
            type: [Boolean, Array] as PropType<boolean | string[]>,
            default: false
        },
        validateOnSubmit: {
            type: [Boolean, Array] as PropType<boolean | string[]>,
            default: true
        }
    },
    provide() {
        return {
            $pcForm: this,
            $parentInstance: this
        };
    }
});
</script>
