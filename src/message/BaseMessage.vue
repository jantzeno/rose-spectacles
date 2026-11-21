<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import MessageStyle from './style/MessageStyle';

export default defineComponent({
    name: 'BaseMessage',
    extends: BaseComponent,
    props: {
        severity: {
            type: String,
            default: 'info'
        },
        closable: {
            type: Boolean,
            default: false
        },
        life: {
            type: Number,
            default: null
        },
        icon: {
            type: String,
            default: undefined
        },
        closeIcon: {
            type: String,
            default: undefined
        },
        closeButtonProps: {
            type: null,
            default: null
        },
        size: {
            type: String,
            default: null
        },
        variant: {
            type: String,
            default: null
        }
    },
    style: MessageStyle,
    provide() {
        return {
            $pcMessage: this,
            $parentInstance: this
        };
    }
});
</script>
