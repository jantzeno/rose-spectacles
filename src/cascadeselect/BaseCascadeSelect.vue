<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import BaseInput from '../core/baseinput/BaseInput.vue';
import CascadeSelectStyle from './style/CascadeSelectStyle';
import type { OptionResolver } from './processed-option';

export default defineComponent({
    name: 'BaseCascadeSelect',
    extends: BaseInput,
    props: {
        options: Array,
        optionLabel: null as unknown as PropType<OptionResolver>,
        optionValue: null as unknown as PropType<OptionResolver>,
        optionDisabled: null as unknown as PropType<OptionResolver>,
        optionGroupLabel: null as unknown as PropType<OptionResolver>,
        optionGroupChildren: null as unknown as PropType<string | string[] | ((option: unknown) => unknown[])>,
        placeholder: String,
        breakpoint: {
            type: String,
            default: '960px'
        },
        dataKey: null as unknown as PropType<string>,
        showClear: {
            type: Boolean,
            default: false
        },
        clearIcon: {
            type: String,
            default: undefined
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
        panelClass: {
            type: [String, Object],
            default: null
        },
        panelStyle: {
            type: Object,
            default: null
        },
        panelProps: {
            type: null,
            default: null
        },
        overlayClass: {
            type: [String, Object],
            default: null
        },
        overlayStyle: {
            type: Object,
            default: null
        },
        overlayProps: {
            type: null,
            default: null
        },
        appendTo: {
            type: [String, Object],
            default: 'body'
        },
        loading: {
            type: Boolean,
            default: false
        },
        dropdownIcon: {
            type: String,
            default: undefined
        },
        loadingIcon: {
            type: String,
            default: undefined
        },
        optionGroupIcon: {
            type: String,
            default: undefined
        },
        autoOptionFocus: {
            type: Boolean,
            default: false
        },
        selectOnFocus: {
            type: Boolean,
            default: false
        },
        focusOnHover: {
            type: Boolean,
            default: true
        },
        searchLocale: {
            type: String,
            default: undefined
        },
        searchMessage: {
            type: String,
            default: null
        },
        selectionMessage: {
            type: String,
            default: null
        },
        emptySelectionMessage: {
            type: String,
            default: null
        },
        emptySearchMessage: {
            type: String,
            default: null
        },
        emptyMessage: {
            type: String,
            default: null
        },
        tabindex: {
            type: Number,
            default: 0
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
    style: CascadeSelectStyle,
    provide() {
        return {
            $pcCascadeSelect: this,
            $parentInstance: this
        };
    }
});
</script>
