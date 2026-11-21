<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import BaseInput from '../core/baseinput/BaseInput.vue';
import SelectStyle from './style/SelectStyle';

type OptionResolver = string | ((option: unknown) => unknown);

export default defineComponent({
    name: 'BaseSelect',
    extends: BaseInput,
    props: {
        options: Array,
        optionLabel: [String, Function] as PropType<OptionResolver>,
        optionValue: [String, Function] as PropType<OptionResolver>,
        optionDisabled: [String, Function] as PropType<OptionResolver>,
        optionGroupLabel: [String, Function] as PropType<OptionResolver>,
        optionGroupChildren: [String, Function] as PropType<OptionResolver>,
        scrollHeight: {
            type: String,
            default: '14rem'
        },
        filter: Boolean,
        filterPlaceholder: String,
        filterLocale: String,
        filterMatchMode: {
            type: String,
            default: 'contains'
        },
        filterFields: {
            type: Array as PropType<string[]>,
            default: null
        },
        editable: Boolean,
        placeholder: {
            type: String,
            default: null
        },
        dataKey: null as unknown as PropType<string>,
        showClear: {
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
        labelId: {
            type: String,
            default: null
        },
        labelClass: {
            type: [String, Object],
            default: null
        },
        labelStyle: {
            type: Object,
            default: null
        },
        panelClass: {
            type: [String, Object],
            default: null
        },
        overlayStyle: {
            type: Object,
            default: null
        },
        overlayClass: {
            type: [String, Object],
            default: null
        },
        panelStyle: {
            type: Object,
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
        clearIcon: {
            type: String,
            default: undefined
        },
        dropdownIcon: {
            type: String,
            default: undefined
        },
        filterIcon: {
            type: String,
            default: undefined
        },
        loadingIcon: {
            type: String,
            default: undefined
        },
        resetFilterOnHide: {
            type: Boolean,
            default: false
        },
        resetFilterOnClear: {
            type: Boolean,
            default: false
        },
        virtualScrollerOptions: {
            type: Object,
            default: null
        },
        autoOptionFocus: {
            type: Boolean,
            default: false
        },
        autoFilterFocus: {
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
        highlightOnSelect: {
            type: Boolean,
            default: true
        },
        checkmark: {
            type: Boolean,
            default: false
        },
        filterMessage: {
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
        emptyFilterMessage: {
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
        ariaLabel: {
            type: String,
            default: null
        },
        ariaLabelledby: {
            type: String,
            default: null
        }
    },
    style: SelectStyle,
    provide() {
        return {
            $pcSelect: this,
            $parentInstance: this
        };
    }
});
</script>
