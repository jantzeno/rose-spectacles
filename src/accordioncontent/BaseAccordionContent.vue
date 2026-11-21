<script>
import BaseComponent from '../core/basecomponent/BaseComponent.vue';
import AccordionContentStyle from './style/AccordionContentStyle';

export default {
    name: 'BaseAccordionContent',
    extends: BaseComponent,
    props: {
        as: {
            type: [String, Object],
            default: 'DIV'
        },
        asChild: {
            type: Boolean,
            default: false
        }
    },
    style: AccordionContentStyle,
    provide() {
        return {
            $pcAccordionContent: this,
            $parentInstance: this
        };
    }
};
</script>
