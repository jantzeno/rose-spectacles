<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import ConfirmPopupStyle from './style/ConfirmPopupStyle';

export default defineComponent({
    name: 'BaseConfirmPopup',
    extends: BaseComponent,
    props: {
        group: String
    },
    style: ConfirmPopupStyle,
    provide() {
        return {
            $pcConfirmPopup: this,
            $parentInstance: this
        };
    }
});
</script>
