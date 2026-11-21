<script lang="ts">
import { defineComponent } from 'vue';
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import AccordionStyle from './style/AccordionStyle';

export default defineComponent({
    name: 'BaseAccordion',
    extends: BaseComponent,
    props: {
        value: {
            type: [String, Number, Array],
            default: undefined
        },
        multiple: {
            type: Boolean,
            default: false
        },
        lazy: {
            type: Boolean,
            default: false
        },
        tabindex: {
            type: Number,
            default: 0
        },
        selectOnFocus: {
            type: Boolean,
            default: false
        },
        expandIcon: {
            type: String,
            default: undefined
        },
        collapseIcon: {
            type: String,
            default: undefined
        },
        // @deprecated since v4.
        activeIndex: {
            type: [Number, Array],
            default: null
        }
    },
    style: AccordionStyle,
    provide() {
        return {
            $pcAccordion: this,
            $parentInstance: this
        };
    }
});
</script>
