<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import ScrollTopStyle from './style/ScrollTopStyle';

export default defineComponent({
    name: 'BaseScrollTop',
    extends: BaseComponent,
    props: {
        target: {
            type: String,
            default: 'window'
        },
        threshold: {
            type: Number,
            default: 400
        },
        icon: {
            type: String,
            default: undefined
        },
        behavior: {
            type: String,
            default: 'smooth'
        },
        buttonProps: {
            type: Object,
            default: () => {
                return { rounded: true };
            }
        }
    },
    style: ScrollTopStyle,
    provide() {
        return {
            $pcScrollTop: this,
            $parentInstance: this
        };
    }
});
</script>
