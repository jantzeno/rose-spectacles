<script>
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import ConfirmPopupStyle from './style/ConfirmPopupStyle';

export default {
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
};
</script>
