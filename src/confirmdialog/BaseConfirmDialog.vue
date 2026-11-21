<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import ConfirmDialogStyle from './style/ConfirmDialogStyle';

export default defineComponent({
    name: 'BaseConfirmDialog',
    extends: BaseComponent,
    props: {
        group: String,
        breakpoints: {
            type: Object,
            default: null
        },
        draggable: {
            type: Boolean,
            default: true
        }
    },
    style: ConfirmDialogStyle,
    provide() {
        return {
            $pcConfirmDialog: this,
            $parentInstance: this
        };
    }
});
</script>
