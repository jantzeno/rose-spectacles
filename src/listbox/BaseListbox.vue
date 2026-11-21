<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import BaseEditableHolder from '../core/baseeditableholder/BaseEditableHolder.vue';
import ListboxStyle from './style/ListboxStyle';

type OptionResolver = string | ((option: unknown) => unknown);

export default defineComponent({
    name: 'BaseListbox',
    extends: BaseEditableHolder,
    props: {
        options: Array,
        optionLabel: null as unknown as PropType<OptionResolver>,
        optionValue: null as unknown as PropType<OptionResolver>,
        optionDisabled: null as unknown as PropType<OptionResolver>,
        optionGroupLabel: null as unknown as PropType<OptionResolver>,
        optionGroupChildren: null as unknown as PropType<OptionResolver>,
        listStyle: null,
        scrollHeight: {
            type: String,
            default: '14rem'
        },
        dataKey: null as unknown as PropType<string>,
        multiple: {
            type: Boolean,
            default: false
        },
        metaKeySelection: {
            type: Boolean,
            default: false
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
        virtualScrollerOptions: {
            type: Object,
            default: null
        },
        autoOptionFocus: {
            type: Boolean,
            default: true
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
        filterIcon: {
            type: String,
            default: undefined
        },
        striped: {
            type: Boolean,
            default: false
        },
        tabindex: {
            type: Number,
            default: 0
        },
        fluid: {
            type: Boolean,
            default: null
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
    style: ListboxStyle,
    provide() {
        return {
            $pcListbox: this,
            $parentInstance: this
        };
    }
});
</script>
