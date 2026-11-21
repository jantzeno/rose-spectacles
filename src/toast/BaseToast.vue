<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import type { ToastInteraction } from './ToastMessage.vue';
import ToastStyle from './style/ToastStyle';

export default defineComponent({
    name: 'BaseToast',
    extends: BaseComponent,
    props: {
        group: {
            type: String,
            default: null
        },
        position: {
            type: String,
            default: 'top-right'
        },
        autoZIndex: {
            type: Boolean,
            default: true
        },
        baseZIndex: {
            type: Number,
            default: 0
        },
        breakpoints: {
            type: Object,
            default: null
        },
        closeIcon: {
            type: String,
            default: undefined
        },
        infoIcon: {
            type: String,
            default: undefined
        },
        warnIcon: {
            type: String,
            default: undefined
        },
        errorIcon: {
            type: String,
            default: undefined
        },
        successIcon: {
            type: String,
            default: undefined
        },
        closeButtonProps: {
            type: null,
            default: null
        },
        onMouseEnter: {
            type: Function as PropType<ToastInteraction>,
            default: undefined
        },
        onMouseLeave: {
            type: Function as PropType<ToastInteraction>,
            default: undefined
        },
        onClick: {
            type: Function as PropType<ToastInteraction>,
            default: undefined
        }
    },
    style: ToastStyle,
    provide() {
        return {
            $pcToast: this,
            $parentInstance: this
        };
    }
});
</script>
