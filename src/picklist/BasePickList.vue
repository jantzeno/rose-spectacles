<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import PickListStyle from './style/PickListStyle';

export default defineComponent({
    name: 'BasePickList',
    extends: BaseComponent,
    props: {
        modelValue: {
            type: Array as PropType<unknown[][]>,
            default: () => [[], []]
        },
        selection: {
            type: Array as PropType<unknown[][]>,
            default: () => [[], []]
        },
        dataKey: {
            type: String,
            default: null
        },
        listStyle: {
            type: null,
            default: null
        },
        metaKeySelection: {
            type: Boolean,
            default: false
        },
        autoOptionFocus: {
            type: Boolean,
            default: true
        },
        focusOnHover: {
            type: Boolean,
            default: true
        },
        responsive: {
            type: Boolean,
            default: true
        },
        breakpoint: {
            type: String,
            default: '960px'
        },
        striped: {
            type: Boolean,
            default: false
        },
        scrollHeight: {
            type: String,
            default: '14rem'
        },
        showSourceControls: {
            type: Boolean,
            default: true
        },
        showTargetControls: {
            type: Boolean,
            default: true
        },
        buttonProps: {
            type: Object,
            default() {
                return { severity: 'secondary' };
            }
        },
        moveUpButtonProps: {
            type: null,
            default: null
        },
        moveTopButtonProps: {
            type: null,
            default: null
        },
        moveDownButtonProps: {
            type: null,
            default: null
        },
        moveBottomButtonProps: {
            type: null,
            default: null
        },
        moveToTargetProps: {
            type: null,
            default: null
        },
        moveAllToTargetProps: {
            type: null,
            default: null
        },
        moveToSourceProps: {
            type: null,
            default: null
        },
        moveAllToSourceProps: {
            type: null,
            default: null
        },
        tabindex: {
            type: Number,
            default: 0
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    style: PickListStyle,
    provide() {
        return {
            $pcPickList: this,
            $parentInstance: this
        };
    }
});
</script>
