<script>
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import SplitterPanelStyle from './style/SplitterPanelStyle';

export default {
    name: 'BaseSplitterPanel',
    extends: BaseComponent,
    props: {
        size: {
            type: Number,
            default: null
        },
        minSize: {
            type: Number,
            default: null
        }
    },
    style: SplitterPanelStyle,
    provide() {
        return {
            $pcSplitterPanel: this,
            $parentInstance: this
        };
    }
};
</script>
