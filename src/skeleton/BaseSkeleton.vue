<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import SkeletonStyle from './style/SkeletonStyle';

export default defineComponent({
    name: 'BaseSkeleton',
    extends: BaseComponent,
    props: {
        shape: {
            type: String,
            default: 'rectangle'
        },
        size: {
            type: String,
            default: null
        },
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '1rem'
        },
        borderRadius: {
            type: String,
            default: null
        },
        animation: {
            type: String,
            default: 'wave'
        }
    },
    style: SkeletonStyle,
    provide() {
        return {
            $pcSkeleton: this,
            $parentInstance: this
        };
    }
});
</script>
