<script>
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import TabStyle from './style/TabStyle';

export default {
    name: 'BaseTab',
    extends: BaseComponent,
    props: {
        value: {
            type: [String, Number],
            default: undefined
        },
        disabled: {
            type: Boolean,
            default: false
        },
        as: {
            type: [String, Object],
            default: 'BUTTON'
        },
        asChild: {
            type: Boolean,
            default: false
        }
    },
    style: TabStyle,
    provide() {
        return {
            $pcTab: this,
            $parentInstance: this
        };
    }
};
</script>
