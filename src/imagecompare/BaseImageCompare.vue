<script>
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import ImageCompareStyle from './style/ImageCompareStyle';

export default {
    name: 'BaseImageCompare',
    extends: BaseComponent,
    props: {
        tabindex: {
            type: Number,
            default: 0
        },
        ariaLabelledby: {
            type: String,
            default: null
        },
        ariaLabel: {
            type: String,
            default: null
        }
    },
    style: ImageCompareStyle,
    provide() {
        return {
            $pcImageCompare: this,
            $parentInstance: this
        };
    }
};
</script>
