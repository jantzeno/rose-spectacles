<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import MenubarStyle from './style/MenubarStyle';

export default defineComponent({
    name: 'BaseMenubar',
    extends: BaseComponent,
    props: {
        model: {
            type: Array,
            default: null
        },
        buttonProps: {
            type: null,
            default: null
        },
        breakpoint: {
            type: String,
            default: '960px'
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
    style: MenubarStyle,
    provide() {
        return {
            $pcMenubar: this,
            $parentInstance: this
        };
    }
});
</script>
