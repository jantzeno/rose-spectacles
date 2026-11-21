<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import ImageStyle from './style/ImageStyle';

export default defineComponent({
    name: 'BaseImage',
    extends: BaseComponent,
    props: {
        preview: {
            type: Boolean,
            default: false
        },
        class: {
            type: null,
            default: null
        },
        style: {
            type: null,
            default: null
        },
        imageStyle: {
            type: null,
            default: null
        },
        imageClass: {
            type: null,
            default: null
        },
        previewButtonProps: {
            type: null,
            default: null
        },
        indicatorIcon: {
            type: String,
            default: undefined
        },
        previewIcon: {
            type: String,
            default: undefined
        },
        zoomInDisabled: {
            type: Boolean,
            default: false
        },
        zoomOutDisabled: {
            type: Boolean,
            default: false
        }
    },
    style: ImageStyle,
    provide() {
        return {
            $pcImage: this,
            $parentInstance: this
        };
    }
});
</script>
