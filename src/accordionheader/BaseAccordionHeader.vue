<script>
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import AccordionHeaderStyle from './style/AccordionHeaderStyle';

export default {
    name: 'BaseAccordionHeader',
    extends: BaseComponent,
    props: {
        as: {
            type: [String, Object],
            default: 'BUTTON'
        },
        asChild: {
            type: Boolean,
            default: false
        }
    },
    style: AccordionHeaderStyle,
    provide() {
        return {
            $pcAccordionHeader: this,
            $parentInstance: this
        };
    }
};
</script>
