<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import InputChipsStyle from './style/InputChipsStyle';

export default defineComponent({
    name: 'BaseInputChips',
    extends: BaseComponent,
    props: {
        modelValue: {
            type: Array as PropType<unknown[]>,
            default: null
        },
        max: {
            type: Number,
            default: null
        },
        separator: {
            type: [String, Object] as PropType<string | RegExp>,
            default: null
        },
        addOnBlur: {
            type: Boolean,
            default: null
        },
        allowDuplicate: {
            type: Boolean,
            default: true
        },
        placeholder: {
            type: String,
            default: null
        },
        variant: {
            type: String,
            default: null
        },
        invalid: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        inputId: {
            type: String,
            default: null
        },
        inputClass: {
            type: [String, Object],
            default: null
        },
        inputStyle: {
            type: Object,
            default: null
        },
        inputProps: {
            type: null,
            default: null
        },
        removeTokenIcon: {
            type: String,
            default: undefined
        },
        chipIcon: {
            type: String,
            default: undefined
        },
        ariaLabelledby: {
            type: String,
            default: null
        },
        ariaLabel: {
            type: String,
            default: null
        }
    },
    style: InputChipsStyle,
    provide() {
        return {
            $pcInputChips: this,
            $parentInstance: this
        };
    }
});
</script>
